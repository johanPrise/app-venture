"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import  slugify  from 'slugify';
import { writeClient } from "@/sanity/lib/write-client";
import { formSchema } from "./validation";
import { cookies, headers } from "next/headers";
import { client } from "@/sanity/lib/client";
import { STARTUP_AUTHOR_QUERY } from "@/sanity/lib/queries";

const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h
const BOT_USER_AGENT = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|curl|wget|python-requests/i;
export const createPitch = async (state: { error?: string; status: string }, form: FormData, pitch: string) => {
    const session = await auth();
    if(!session){
        return parseServerActionResponse({
            error: "Unauthorized",
            status: "ERROR"
        });
    }
        const {title, description, category, link} = Object.fromEntries(Array.from(form).filter(([key]) => key != 'pitch'));
        const validation = await formSchema.safeParseAsync({title, description, category, link, pitch});
        if(!validation.success){
            const fieldErrors = validation.error.flatten().fieldErrors;
            const error = Object.entries(fieldErrors)
                .map(([field, messages]) => `${field}: ${messages?.[0]}`)
                .join('; ');
            return parseServerActionResponse({
                error: `Validation failed - ${error}`,
                status: "ERROR"
            });
        }
        const slug = slugify(validation.data.title, {lower: true ,strict: true});
        try{
            const startup = {
                title: validation.data.title,
                description: validation.data.description,
                category: validation.data.category,
                image: validation.data.link,
                pitch: validation.data.pitch,
                slug:{
                    _type: "slug",
                    current: slug,
                },
                author: {
                    _type: 'reference',
                    _ref: session?.id,
                },
            };
            const result = await writeClient.create({_type:'startup', ...startup});

            return parseServerActionResponse({
                _id: result._id,
                status: 'SUCCESS'
            })
        } catch(error) {
            console.log(error)
            return parseServerActionResponse({
                error: error instanceof Error ? error.message : String(error),
                status: "ERROR"
            })
        }
    }

export const incrementView = async (startupId: string) => {
    if(typeof startupId !== 'string' || !/^[A-Za-z0-9._-]{1,128}$/.test(startupId)) return;

    const userAgent = (await headers()).get('user-agent');
    if(!userAgent || BOT_USER_AGENT.test(userAgent)) return;

    const cookieStore = await cookies();
    const cookieName = `viewed_${startupId}`;
    if(cookieStore.get(cookieName)) return;

    const startup = await client
        .withConfig({ useCdn: false })
        .fetch(STARTUP_AUTHOR_QUERY, { id: startupId });
    if(!startup) return;

    const session = await auth();
    if(session?.id && session.id === startup.authorId) return;

    await writeClient
        .patch(startup._id)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit();

    cookieStore.set(cookieName, '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: VIEW_COOKIE_MAX_AGE,
    });
}
