import { http, HttpResponse } from "msw";

export const handlers = [
  // POST /booking
  http.post(
    "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking",
    async ({ request }) => {
      const body = await request.json();
      console.log("Body från bokning:", body);

      // Du kan validera body här om du vill
      // t.ex. kolla antal banor, spelare, skor osv.

      const confirmation = {
        bookingDetails: {
          when: body.when,
          lanes: body.lanes,
          people: body.people,
          shoes: body.shoes,
          bookingId: "12345",
          price: 1000,
        },
      };

      return HttpResponse.json(confirmation, { status: 200 });
    }
  ),
];
