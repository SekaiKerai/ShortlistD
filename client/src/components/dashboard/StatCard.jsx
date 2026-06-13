import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value }) => {
  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">{title}</p>

        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </CardContent>
    </Card>
  );
};

export default StatCard;
