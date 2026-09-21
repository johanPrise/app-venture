import { type SchemaTypeDefinition } from 'sanity'
import { Author } from './author'
import { Startup } from './startup'
import {playlist} from './playlist'
import { Vote } from './vote'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [Author, Startup, playlist, Vote],
}
