import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ConfirmationCard({
  isFeedbackReceived,
}: {
  isFeedbackReceived: boolean;
}) {
  return (
    <Card className="w-full max-w-md border-black mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-black">
          {isFeedbackReceived ? "Feedback Received" : "Order Rejected"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {isFeedbackReceived ? (
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500" />
        )}
        <p className="text-center text-black">
          {isFeedbackReceived
            ? "Thank you for your feedback. Your submission has been successfully received."
            : "You have rejected this order. If this was a mistake, please contact our support team."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="outline"
          className="border-black text-black hover:bg-gray-100"
        >
          Back to Home
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Response({ params }: { params: { response: string } }) {
  const response = params.response;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 space-y-8">
      <ConfirmationCard isFeedbackReceived={response == "confirm"} />
    </div>
  );
}
