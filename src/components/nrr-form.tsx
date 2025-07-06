import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { matchSchema, type MatchSchemaData } from "../validation/nrrform-validation";
import { matchOptions } from "../utils/util";
import { calculateNRR } from "../services/nrr.service";
import ResultModal from "./result-modal";

/**
 * NRRForm is a React component that renders a form to input the required
 * information to calculate the Net Run Rate (NRR) impact of a cricket match.
 * The form includes the teams involved, the number of overs, desired position,
 * toss result, and runs scored. When the form is submitted, it sends a request
 * to an API endpoint to calculate the NRR impact and displays the result in a
 * modal dialog.
 *
 * @returns A React component that renders the NRR calculation form and
 *   displays the result in a modal dialog when submitted.
 */
export default function NRRForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [submittedData, setSubmittedData] = useState<MatchSchemaData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MatchSchemaData>({
    resolver: zodResolver(matchSchema),
  });

  const onSubmit = async (data: MatchSchemaData) => {
    try {
      const response = await calculateNRR(data);
      setResultData(response);
      setSubmittedData(data);
      setModalOpen(true);
    } catch (error: any) {
      const message = error.response?.data?.error ?? error.message ?? "Error calculating NRR";
      alert(`Error: ${message}`);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">NRR Calculator</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* --- Team Selection --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Team</label>
              <select {...register("yourTeam")} className="w-full border p-2 rounded-md">
                <option value="">Select Team</option>
                {matchOptions.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              {errors.yourTeam && <p className="text-red-500 text-sm">{errors.yourTeam.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Opponent Team</label>
              <select {...register("oppositionTeam")} className="w-full border p-2 rounded-md">
                <option value="">Select Team</option>
                {matchOptions.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              {errors.oppositionTeam && <p className="text-red-500 text-sm">{errors.oppositionTeam.message}</p>}
            </div>
          </div>

          {/* --- Match Details --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Match Overs</label>
              <input
                type="number"
                placeholder="e.g. 20"
                {...register("matchOvers", { valueAsNumber: true })}
                className="w-full border p-2 rounded-md"
              />
              {errors.matchOvers && <p className="text-red-500 text-sm">{errors.matchOvers.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Desired Position</label>
              <input
                type="number"
                placeholder="1-5"

                {...register("desiredPosition", { valueAsNumber: true })}
                className="w-full border p-2 rounded-md"
              />
              {errors.desiredPosition && <p className="text-red-500 text-sm">{errors.desiredPosition.message}</p>}
            </div>
          </div>

          {/* --- Toss and Runs --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Toss Result</label>
              <select {...register("tossResult")} className="w-full border p-2 rounded-md">
                <option value="">Choose...</option>
                <option value="bat">Batting First</option>
                <option value="bowl">Bowling First</option>
              </select>
              {errors.tossResult && <p className="text-red-500 text-sm">{errors.tossResult.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Runs Scored (or to Chase)</label>
              <input
                type="number"
                placeholder="e.g. 120"
                {...register("runsScored", { valueAsNumber: true })}
                className="w-full border p-2 rounded-md"
              />
              {errors.runsScored && <p className="text-red-500 text-sm">{errors.runsScored.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Calculate NRR Impact
          </button>
        </form>
      </div>

      {resultData && submittedData && (
        <ResultModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          result={resultData}
          data={submittedData}
        />
      )}
    </div>
  );
}
