import slug from 'slug';
import uniqueSlug from 'unique-slug';

const slugString = (text) =>
  `${slug(text.toLowerCase().substring(0, 255))}-${uniqueSlug()}`;

export default slugString;
