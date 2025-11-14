"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';

// This is the ID of the div element where the scanner will be mounted.
const QR_SCANNER_ELEMENT_ID = "qr-code-reader";

export default function ScanPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    let html5QrcodeScanner: Html5QrcodeScanner | null = null;

    // Success callback
    const onScanSuccess = (decodedText: string) => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
      
      setScanResult(decodedText);
      
      try {
        const url = new URL(decodedText);
        const tableId = url.searchParams.get('table_id');
        const restaurantId = url.searchParams.get('restaurant_id');

        // TODO: Save tableId and restaurantId to a global context
        // e.g., setTableId(tableId);

        // --- THIS IS THE FIX ---
        // Redirect to the correct path, which does not include (customer)
        router.push('/menu'); 
        
      } catch (error) {
        console.error("Scanned QR code is not a valid URL:", decodedText);
        setScanError("Invalid QR code. Please scan a valid restaurant code.");
      }
    };

    // Failure callback (optional)
    const onScanFailure = (error: string) => {
      // This will fire continuously, so we'll just log it
      // console.warn(`QR scan error: ${error}`);
    };

    // Check if the scanner element exists
    if (document.getElementById(QR_SCANNER_ELEMENT_ID)) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        QR_SCANNER_ELEMENT_ID,
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Size of the scanning box
          rememberLastUsedCamera: true,
          supportedScanTypes: [] // Use all available scan types
        },
        /* verbose= */ false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }

    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear scanner on unmount", error);
        });
      }
    };
  }, [router]);

  return (
    <div className="container mx-auto p-4 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-4">Scan QR Code</h1>
      <p className="text-gray-600 mb-6">
        Please scan the QR code on your table to see the menu.
      </p>

      <div id={QR_SCANNER_ELEMENT_ID} className="w-full"></div>

      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
          <p className="font-bold">Scan Successful!</p>
          <p className="text-sm">Redirecting you to the menu...</p>
        </div>
      )}

      {scanError && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          <p className="font-bold">Scan Error</p>
          <p className="text-sm">{scanError}</p>
        </div>
      )}
    </div>
  );
}
