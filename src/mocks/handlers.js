import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(
    "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking",
    async ({ request }) => {
      const body = await request.json();
      // console.log("Body från bokning:", body);

      const confirmation = {
        bookingDetails: {
          when: body.when,
          lanes: body.lanes,
          people: body.people,
          shoes: body.shoes,
          bookingId: "12345",
          price: body.people * 120 + body.lanes * 100,
        },
      };

      return HttpResponse.json(confirmation, { status: 200 });
    }
  ),
];
