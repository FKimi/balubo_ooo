// Shared route context type for Next.js app router API handlers
// Use a generic to specify the params key–value mapping for the route segment.
// Example:
//   export async function GET(
//     req: NextRequest,
//     context: RouteContext<{ id: string }>
//   ) {}
//
// This removes the need for `any` and keeps route files strongly-typed while
// remaining flexible to different param names.
export interface RouteContext<
  Params extends Record<string, string> = Record<string, string>,
> {
  params: Params;
}
