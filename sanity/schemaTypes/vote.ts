import {defineType, defineField} from 'sanity';
import { ThumbsUpIcon } from '@sanity/icons';
export const Vote = defineType({
    name:'vote',
    title: 'Vote',
    type: 'document',
    icon : ThumbsUpIcon,
    fields: [
        defineField({
            name: 'author',
            type: 'reference',
            to: {type: 'author'},
            validation:(Rule) => Rule.required(),
        }),
        defineField({
            name: 'startup',
            type: 'reference',
            to: {type: 'startup'},
            validation:(Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'startup.title',
            subtitle: 'author.name',
        }
    }
})
