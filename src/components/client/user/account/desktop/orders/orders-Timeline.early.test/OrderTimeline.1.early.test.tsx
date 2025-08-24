import React from 'react'
import { OrderTimeline } from '../orders-Timeline';

// orders-Timeline.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// orders-Timeline.test.tsx
// Mock lucide-react icons to simple components for testability
jest.mock("lucide-react", () => ({
  FileText: (props: any) => <svg data-testid="FileText" {...props} />,
  DollarSign: (props: any) => <svg data-testid="DollarSign" {...props} />,
  Truck: (props: any) => <svg data-testid="Truck" {...props} />,
  Package: (props: any) => <svg data-testid="Package" {...props} />,
  Star: (props: any) => <svg data-testid="Star" {...props} />,
}));

describe('OrderTimeline() OrderTimeline method', () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("renders all steps with correct labels and icons", () => {
      // This test ensures that all steps and their icons/labels are rendered
      render(<OrderTimeline />);
      expect(screen.getByText("Đơn Hàng Đã Đặt")).toBeInTheDocument();
      expect(screen.getByText("Đã Xác Nhận Thanh Toán")).toBeInTheDocument();
      expect(screen.getByText("Đã Giao Cho ĐVVC")).toBeInTheDocument();
      expect(screen.getByText("Đã Nhận Được Hàng")).toBeInTheDocument();
      expect(screen.getByText("Đơn Hàng Hoàn Thành")).toBeInTheDocument();

      expect(screen.getByTestId("FileText")).toBeInTheDocument();
      expect(screen.getByTestId("DollarSign")).toBeInTheDocument();
      expect(screen.getByTestId("Truck")).toBeInTheDocument();
      expect(screen.getByTestId("Package")).toBeInTheDocument();
      expect(screen.getByTestId("Star")).toBeInTheDocument();
    });

    it("renders the correct number of step circles and connecting lines", () => {
      // This test ensures that there are 5 step circles and 4 connecting lines
      render(<OrderTimeline />);
      // There are 5 steps, so 5 circles (each with an icon)
      expect(screen.getAllByRole("img").length).toBe(5);
      // There are 4 connecting lines (one between each pair of steps)
      // We can query by the connecting line's style or class
      // However, due to Tailwind's class merging, let's check by style and class
      const allLines = document.querySelectorAll(
        'div[style*="translateX(50%)"]'
      );
      expect(allLines.length).toBe(4);
    });

    it("applies active styles to steps up to and including the current step", () => {
      // This test ensures that the first three steps are styled as active
      render(<OrderTimeline />);
      // The first three steps should have text-gray-800 (active), the rest text-gray-400 (inactive)
      const labels = [
        "Đơn Hàng Đã Đặt",
        "Đã Xác Nhận Thanh Toán",
        "Đã Giao Cho ĐVVC",
        "Đã Nhận Được Hàng",
        "Đơn Hàng Hoàn Thành",
      ];
      labels.forEach((label, idx) => {
        const el = screen.getByText(label);
        if (idx <= 2) {
          expect(el).toHaveClass("text-gray-800");
        } else {
          expect(el).toHaveClass("text-gray-400");
        }
      });
    });

    it("applies correct background gradient to active step circles", () => {
      // This test ensures that the first three step circles have the active gradient class
      render(<OrderTimeline />);
      // Find all step circles by their parent class
      const circles = document.querySelectorAll(
        'div.flex.items-center.justify-center.w-14.h-14.rounded-full'
      );
      // The first three should have the gradient class
      for (let i = 0; i <= 2; i++) {
        expect(circles[i].className).toMatch(/bg-gradient-to-r/);
        expect(circles[i].className).toMatch(/from-teal-400/);
        expect(circles[i].className).toMatch(/to-blue-500/);
      }
      // The last two should have the inactive class
      for (let i = 3; i < 5; i++) {
        expect(circles[i].className).toMatch(/bg-gray-100/);
        expect(circles[i].className).toMatch(/text-gray-400/);
      }
    });

    it("applies correct background gradient to connecting lines up to current step", () => {
      // This test ensures that the first two connecting lines have the active gradient class
      render(<OrderTimeline />);
      // Find all connecting lines
      const allLines = document.querySelectorAll(
        'div[style*="translateX(50%)"]'
      );
      // The first two should have the gradient class
      for (let i = 0; i < 2; i++) {
        expect(allLines[i].className).toMatch(/bg-gradient-to-r/);
        expect(allLines[i].className).toMatch(/from-teal-400/);
        expect(allLines[i].className).toMatch(/to-blue-500/);
      }
      // The last two should have the inactive class
      for (let i = 2; i < 4; i++) {
        expect(allLines[i].className).toMatch(/bg-gray-300/);
      }
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("renders correctly when there are no steps (edge case)", () => {
      // This test simulates the edge case where steps array is empty
      // We'll temporarily override the steps array in the module
      const originalSteps = (OrderTimeline as any).__proto__.steps;
      (OrderTimeline as any).__proto__.steps = [];
      // Render and expect no step labels or icons
      render(<OrderTimeline />);
      expect(screen.queryByText("Đơn Hàng Đã Đặt")).not.toBeInTheDocument();
      expect(screen.queryByTestId("FileText")).not.toBeInTheDocument();
      // Restore steps
      (OrderTimeline as any).__proto__.steps = originalSteps;
    });

    it("renders correctly when currentStepIndex is at the first step", () => {
      // This test simulates the edge case where currentStepIndex = 0
      // We'll temporarily override the currentStepIndex in the module
      const originalIndex = (OrderTimeline as any).__proto__.currentStepIndex;
      (OrderTimeline as any).__proto__.currentStepIndex = 0;
      render(<OrderTimeline />);
      // Only the first step should be active
      const labels = [
        "Đơn Hàng Đã Đặt",
        "Đã Xác Nhận Thanh Toán",
        "Đã Giao Cho ĐVVC",
        "Đã Nhận Được Hàng",
        "Đơn Hàng Hoàn Thành",
      ];
      expect(screen.getByText(labels[0])).toHaveClass("text-gray-800");
      for (let i = 1; i < labels.length; i++) {
        expect(screen.getByText(labels[i])).toHaveClass("text-gray-400");
      }
      // Restore currentStepIndex
      (OrderTimeline as any).__proto__.currentStepIndex = originalIndex;
    });

    it("renders correctly when currentStepIndex is at the last step", () => {
      // This test simulates the edge case where currentStepIndex = steps.length - 1
      const originalIndex = (OrderTimeline as any).__proto__.currentStepIndex;
      (OrderTimeline as any).__proto__.currentStepIndex = 4;
      render(<OrderTimeline />);
      // All steps should be active
      const labels = [
        "Đơn Hàng Đã Đặt",
        "Đã Xác Nhận Thanh Toán",
        "Đã Giao Cho ĐVVC",
        "Đã Nhận Được Hàng",
        "Đơn Hàng Hoàn Thành",
      ];
      labels.forEach((label) => {
        expect(screen.getByText(label)).toHaveClass("text-gray-800");
      });
      // Restore currentStepIndex
      (OrderTimeline as any).__proto__.currentStepIndex = originalIndex;
    });

    it("renders correctly when currentStepIndex is out of bounds (greater than steps)", () => {
      // This test simulates the edge case where currentStepIndex > steps.length - 1
      const originalIndex = (OrderTimeline as any).__proto__.currentStepIndex;
      (OrderTimeline as any).__proto__.currentStepIndex = 10;
      render(<OrderTimeline />);
      // All steps should be active
      const labels = [
        "Đơn Hàng Đã Đặt",
        "Đã Xác Nhận Thanh Toán",
        "Đã Giao Cho ĐVVC",
        "Đã Nhận Được Hàng",
        "Đơn Hàng Hoàn Thành",
      ];
      labels.forEach((label) => {
        expect(screen.getByText(label)).toHaveClass("text-gray-800");
      });
      // Restore currentStepIndex
      (OrderTimeline as any).__proto__.currentStepIndex = originalIndex;
    });

    it("renders correctly when currentStepIndex is negative", () => {
      // This test simulates the edge case where currentStepIndex < 0
      const originalIndex = (OrderTimeline as any).__proto__.currentStepIndex;
      (OrderTimeline as any).__proto__.currentStepIndex = -1;
      render(<OrderTimeline />);
      // All steps should be inactive
      const labels = [
        "Đơn Hàng Đã Đặt",
        "Đã Xác Nhận Thanh Toán",
        "Đã Giao Cho ĐVVC",
        "Đã Nhận Được Hàng",
        "Đơn Hàng Hoàn Thành",
      ];
      labels.forEach((label) => {
        expect(screen.getByText(label)).toHaveClass("text-gray-400");
      });
      // Restore currentStepIndex
      (OrderTimeline as any).__proto__.currentStepIndex = originalIndex;
    });
  });
});