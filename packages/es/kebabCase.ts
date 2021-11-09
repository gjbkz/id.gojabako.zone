export const kebabCase = (input: string) => input
.replace(/^[^\w-]*|[^\w-]*$/g, '')
.replace(/[^\w-]+/g, '-')
.toLowerCase();
