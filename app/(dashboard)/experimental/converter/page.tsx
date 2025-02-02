import { ExperimentalClient } from "./components/client";

export const metadata = {
    title: "Experimental",
}

const ImportPage = async () => {
    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <h1 className="bg-red-500 text-white text-center">EXPERIMENTAL</h1>
                    <ExperimentalClient />
                </div>
            </div>
        </>
    );
}

export default ImportPage;