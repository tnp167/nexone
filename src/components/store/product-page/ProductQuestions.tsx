import { MessageCircleMore, MessageCircleQuestion } from "lucide-react";
import { FC } from "react";

interface Question {
  question: string;
  answer: string;
}

interface Props {
  questions: Question[];
}

const ProductQuestions: FC<Props> = ({ questions }) => {
  return (
    <div className="pt-6">
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">
          Questions & Answers ({questions.length})
        </h2>
      </div>
      {/* List */}
      <div className="mt-4">
        <ul className="space-y-5">
          {questions.map((question, idx) => (
            <li key={idx} className="relative mb-1">
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <MessageCircleQuestion className="w-4" />
                  <p className="text-sm leading-5">{question.question}</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <MessageCircleMore className="w-4" />
                  <p className="text-sm leading-5">{question.answer}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductQuestions;
