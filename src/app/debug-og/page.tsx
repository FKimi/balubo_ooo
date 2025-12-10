import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function DebugOGPage({
    searchParams,
}: {
    searchParams: Promise<{ workId: string }>;
}) {
    const { workId } = await searchParams;

    if (!workId) {
        return <div>Please provide a workId query parameter.</div>;
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    const { data: work, error } = await supabase
        .from("works")
        .select("*")
        .eq("id", workId)
        .single();

    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    if (!work) {
        return <div>Work not found</div>;
    }

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">OGP Debug Info</h1>
            <div className="space-y-4">
                <div>
                    <h2 className="font-bold">Work ID</h2>
                    <p>{work.id}</p>
                </div>
                <div>
                    <h2 className="font-bold">Title</h2>
                    <p>{work.title}</p>
                </div>
                <div>
                    <h2 className="font-bold">Banner Image URL</h2>
                    <p className="break-all">{work.banner_image_url || "None"}</p>
                    {work.banner_image_url && (
                        <div className="mt-2">
                            <img
                                src={work.banner_image_url}
                                alt="Banner"
                                className="max-w-md border border-gray-300"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="font-bold">Preview Data Image</h2>
                    <p className="break-all">{work.preview_data?.image || "None"}</p>
                    {work.preview_data?.image && (
                        <div className="mt-2">
                            <img
                                src={work.preview_data.image}
                                alt="Preview"
                                className="max-w-md border border-gray-300"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
