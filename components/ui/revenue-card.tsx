import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueCardInterface {
    title: string,
    optionalDesc?: string;
    description1: string,
    description2: string,
    revenue1: string,
    revenue2: string,
}

const RevenueCard: React.FC<RevenueCardInterface> = ({
    title,
    optionalDesc,
    description1,
    description2,
    revenue1,
    revenue2
}) => {
    return (
        <Card className="pr-32">
            <CardHeader>
                <CardTitle className="font-semibold text-md">{title}</CardTitle>
                <CardDescription>{optionalDesc}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-8">
                <div>
                    <p className="text-lg font-bold">{revenue1}</p>
                    <CardDescription className="font-normal">
                        {description1}
                    </CardDescription>
                </div>
                <div>
                    <p className="text-lg font-bold">{revenue2}</p>
                    <CardDescription className="font-normal">
                        {description2}
                    </CardDescription>
                </div>
            </CardContent>
        </Card>
    );
}

export default RevenueCard;