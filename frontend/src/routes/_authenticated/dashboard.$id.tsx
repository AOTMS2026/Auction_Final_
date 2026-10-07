import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/my-auctions/$id",
      params: { id: params.id },
    });
  },
  component: () => null,
});

export default Route;
