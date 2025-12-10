import "@testing-library/jest-dom/vitest";
import { server } from "./src/mocks/server";
import { beforeAll } from "vitest";

beforeAll(() => server.listen());
afterAll(() => server.close());
