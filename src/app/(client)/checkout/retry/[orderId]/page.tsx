import RetryPaymentPage from './RetryPaymentPage';

interface PageProps {
  params: {
    orderId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <RetryPaymentPage orderId={params.orderId} />;
}
