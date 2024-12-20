import { getCurrentDayReport } from "@/actions/get-current-day-revenue";
import { InformesClient } from "./components/client";


export const metadata = {
    title: "Informes",
}

export const dynamic = 'force-dynamic';

const InformesPage = async () => {


    let currentReport = "";
    currentReport = await getCurrentDayReport();



    return (
        <>
            <InformesClient
                currentReport={currentReport}
            />
        </>
    );
}

export default InformesPage;