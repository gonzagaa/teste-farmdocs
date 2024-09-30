import axios from "axios";
import { MEMBROS_API_URL } from "./constants";
import { Subscription, SubscriptionsResponse } from "./types";

async function fetchUserSubscriptions(email: string) {
  try {
    const res = await axios.get(
      `${MEMBROS_API_URL}/subscription/customer/email/${email}`
    );

    return res.data as SubscriptionsResponse;
  } catch (e) {
    console.log("erro fetchUsersubscriptions", e);
  }
}

export { fetchUserSubscriptions };
