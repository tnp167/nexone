import { Dot, Info } from "lucide-react";
import React from "react";

const instructions = [
  {
    info: 'Use your real photo as the profile picture. To update, click on the image, then select "Manage Account."',
  },
  {
    info: "Make sure your first and last name are your real names to ensure they get approved.",
  },
  {
    info: "Ensure your email address is correct. This is how we will contact you for important updates.",
  },
  {
    info: "Provide a valid phone number so customers can reach you if necessary.",
  },
  {
    info: "Set up your store logo and cover photo to make your store more attractive to customers.",
  },
  {
    info: "Specify default shipping details like service, fees, and delivery time to streamline orders.",
  },
  {
    info: "Include a clear return policy to build trust and avoid disputes.",
  },
  {
    info: "Double-check your store's URL to ensure it's working and easy for customers to find.",
  },
  {
    info: "Enter a detailed store description that highlights your offerings and what sets your store apart.",
  },
  {
    info: "Fill in the default shipping fee fields carefully to avoid discrepancies during order processing.",
  },
  {
    info: "Provide a realistic delivery time range to set clear expectations for your customers.",
  },
  {
    info: "Review all details before submitting to ensure everything is accurate and complete for approval.",
  },
];

const Instructions = () => {
  return (
    <div className="h-[calc(100vh-60px)] bg-teal-100 border-teal-500 border-t-4 text-teal-900 px-4 py-3 shadow-md">
      <div className="flex">
        <div className="me-1">
          <Info className="stroke-teal-500" />
        </div>
        <div>
          <p className="font-bold">
            {instructions.map((instruction, idx) => (
              <div key={idx} className="flex gap-x-1 mt-1">
                <Dot className="w-4 h-4" />
                <p className="text-sm">{instruction.info}</p>
              </div>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
