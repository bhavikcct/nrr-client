import axios from "axios";
import type { MatchSchemaData } from "../validation/nrrform-validation";

/**
 * Calls the NRR calculation API endpoint to calculate the required
 * runs and overs to achieve a desired NRR based on the provided match
 * data. The API endpoint is set via the VITE_API_URL environment variable.
 *
 * @param {MatchSchemaData} data - Match data to calculate NRR for
 * @returns {Promise<object>} - Result object containing the required runs
 *   and overs to achieve the desired NRR
 */
export const calculateNRR = async (data: MatchSchemaData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/calculate`,
    data
  );
  return response.data;
};
