import React from 'react'
import OrderTimeline from '../orders-Timeline';

// orders-Timeline.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// orders-Timeline.test.tsx
// No non-core React hooks to mock in this component

describe('OrderTimeline() OrderTimeline method', () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    test("renders all timeline steps with correct labels and times", () => {
      // This test ensures that all steps are rendered with their respective labels and times.
      render(<OrderTimeline />);
      expect(screen.getByText("Đơn Hàng Đã Đặt")).toBeInTheDocument();
      expect(screen.getByText("18:24 08-06-2025")).toBeInTheDocument();

      expect(screen.getByText("Đã Xác Nhận Thanh Toán")).toBeInTheDocument();
      expect(screen.getByText("18:54 08-06-2025")).toBeInTheDocument();

      expect(screen.getByText("Đã Giao Cho ĐVVC")).toBeInTheDocument();
      expect(screen.getByText("11:03 09-06-2025")).toBeInTheDocument();

      expect(screen.getByText("Đã Nhận Được Hàng")).toBeInTheDocument();
      expect(screen.getByText("19:04 12-06-2025")).toBeInTheDocument();

      expect(screen.getByText("Đơn Hàng Đã Hoàn Thành")).toBeInTheDocument();
      expect(screen.getByText("23:59 12-07-2025")).toBeInTheDocument();
    });

    test("renders all icons for each step", () => {
      // This test ensures that each step's icon is rendered.
      render(<OrderTimeline />);
      // The icons are SVGs with class 'w-6 h-6 text-green-500'
      const icons = screen.getAllByRole("img", { hidden: true });
      // There are 5 steps, so 5 icons should be rendered
      expect(icons.length).toBe(5);
    });

    test("renders the horizontal progress bar", () => {
      // This test ensures that the horizontal bar is present.
      render(<OrderTimeline />);
      // The bar is a div with class 'absolute top-7 left-0 right-0 h-[2px] bg-green-500'
      const bar = document.querySelector(
        "div.absolute.top-7.left-0.right-0.h-\\[2px\\].bg-green-500"
      );
      expect(bar).toBeInTheDocument();
    });

    test("renders the correct number of step containers", () => {
      // This test ensures that there are 5 step containers (one for each step).
      render(<OrderTimeline />);
      // Each step container has class 'flex flex-col items-center w-1/5'
      const stepContainers = document.querySelectorAll(
        ".flex.flex-col.items-center.w-1\\/5"
      );
      expect(stepContainers.length).toBe(5);
    });

    test("renders the correct structure for each step", () => {
      // This test ensures that each step has a circle with an icon and a label/time below.
      render(<OrderTimeline />);
      const stepContainers = document.querySelectorAll(
        ".flex.flex-col.items-center.w-1\\/5"
      );
      stepContainers.forEach((container) => {
        // Circle with icon
        const circle = container.querySelector(
          ".flex.items-center.justify-center.w-14.h-14.rounded-full.border-2.border-green-500.bg-white"
        );
        expect(circle).toBeInTheDocument();

        // Label
        const label = container.querySelector(".text-sm.font-medium");
        expect(label).toBeInTheDocument();

        // Time
        const time = container.querySelector(".text-xs.text-gray-500");
        expect(time).toBeInTheDocument();
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("renders nothing extra when steps array is as expected", () => {
      // This test ensures that only the expected number of steps are rendered and no extra elements.
      render(<OrderTimeline />);
      // There should be exactly 5 step containers
      const stepContainers = document.querySelectorAll(
        ".flex.flex-col.items-center.w-1\\/5"
      );
      expect(stepContainers.length).toBe(5);

      // There should be no step with an unexpected label
      expect(screen.queryByText("Unexpected Step")).not.toBeInTheDocument();
    });

    test("does not render any null or undefined labels or times", () => {
      // This test ensures that no step renders a label or time that is null or undefined.
      render(<OrderTimeline />);
      // Check that no element with text 'null' or 'undefined' exists
      expect(screen.queryByText("null")).not.toBeInTheDocument();
      expect(screen.queryByText("undefined")).not.toBeInTheDocument();
    });

    test("renders correctly even if icons are not visible to accessibility tree", () => {
      // This test ensures that the icons are present even if not accessible by default.
      render(<OrderTimeline />);
      // The icons are SVGs, which may not have a role by default
      // We check for SVG elements with the expected class
      const iconSvgs = document.querySelectorAll("svg.w-6.h-6.text-green-500");
      expect(iconSvgs.length).toBe(5);
    });

    test("renders with correct order of steps", () => {
      // This test ensures that the steps are rendered in the correct order.
      render(<OrderTimeline />);
      const labels = [
        "Đơn Hàng Đã Đặt",
        "Đã Xác Nhận Thanh Toán",
        "Đã Giao Cho ĐVVC",
        "Đã Nhận Được Hàng",
        "Đơn Hàng Đã Hoàn Thành",
      ];
      const renderedLabels = screen
        .getAllByText(/./)
        .filter((el) => labels.includes(el.textContent || ""));
      // The order of rendered labels should match the order in the array
      expect(renderedLabels.map((el) => el.textContent)).toEqual(labels);
    });
  });
});