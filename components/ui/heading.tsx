interface HeadingProps {
    title: string;
    description: string | React.ReactNode;
    description2?: string;
    className?: string;
};

export const Heading: React.FC<HeadingProps> = ({
    title,
    description,
    description2,
    className,
}) => {
    return (
        <div className={className}>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <div className="text-sm text-muted-foreground">
                {description}
            </div>
            <p className="text-sm text-muted-foreground">
                {description2}
            </p>
        </div>
    )
}