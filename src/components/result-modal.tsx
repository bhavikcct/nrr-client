import ReactDOM from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  result: {
    mode: "bat" | "bowl";
    answer?: {
      restrictRunsMin?: number;
      restrictRunsMax?: number;
      minOvers?: number;
      maxOvers?: number;
      revisedNRRMin: number;
      revisedNRRMax: number;
    };
  };
  data: {
    yourTeam: string;
    oppositionTeam: string;
    matchOvers: number;
    runsScored: number;
  };
};

/**
 * ResultModal is a component that displays the calculated Net Run Rate (NRR) 
 * result of a cricket match in a modal dialog. It presents information about 
 * the required runs and overs to achieve a desired NRR, based on the current 
 * match data and result mode (batting or bowling). The modal can be closed 
 * using a provided callback function.
 *
 * Props:
 * - isOpen: Boolean indicating if the modal should be displayed.
 * - onClose: Function to call when the modal is closed.
 * - result: Object containing the mode of play ('bat' or 'bowl') and answer 
 *   details, including required runs, overs, and revised NRR range.
 * - data: Object containing match details such as the teams involved, 
 *   match overs, and runs scored.
 */

export default function ResultModal({ isOpen, onClose, result, data }: Props) {
  if (!isOpen || !result || !result.answer) return null; // Added check

  const { yourTeam, oppositionTeam, matchOvers, runsScored } = data;
  const { mode, answer } = result;
  const {
    restrictRunsMin,
    restrictRunsMax,
    minOvers,
    maxOvers,
    revisedNRRMin,
    revisedNRRMax,
  } = answer;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
          NRR Result
        </h2>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          {mode === "bat" ? (
            <div>
              <strong>Q-1a:</strong> If <strong>{yourTeam}</strong> score{" "}
              <strong>{runsScored} runs</strong> in{" "}
              <strong>{matchOvers} overs</strong>, <strong>{yourTeam}</strong>{" "}
              need to restrict <strong>{oppositionTeam}</strong> between{" "}
              <strong>
                {restrictRunsMin} to {restrictRunsMax} runs
              </strong>{" "}
              in <strong>{matchOvers} overs</strong>.
              <br />
              Revised NRR of <strong>{yourTeam}</strong> will be between{" "}
              <strong>
                {revisedNRRMin.toFixed(3)} to {revisedNRRMax.toFixed(3)}
              </strong>
              .
            </div>
          ) : (
            <div>
              <strong>Q-1b:</strong> <strong>{yourTeam}</strong> need to chase{" "}
              <strong>{runsScored} runs</strong> between{" "}
              <strong>
                {minOvers} to {maxOvers} overs
              </strong>
              .
              <br />
              Revised NRR for <strong>{yourTeam}</strong> will be between{" "}
              <strong>
                {revisedNRRMin.toFixed(3)} to {revisedNRRMax.toFixed(3)}
              </strong>
              .
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
