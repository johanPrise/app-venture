"use server"

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import  slugify  from 'slugify';
import { writeClient } from "@/sanity/lib/write-client";
import { formSchema } from "./validation";
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
