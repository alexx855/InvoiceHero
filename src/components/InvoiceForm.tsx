"use client";

import { INVOICE_MOCK, ITEM_MOCK } from "@/constants";
import { invoiceHeroConfig } from "@/generated";
import { useLit } from "@/hooks/useLit";
import {
  InvoiceData,
  InvoiceDataItems,
  InvoiceStatus,
  formatAmount,
} from "@/invoice";
import { encryptString } from "@lit-protocol/lit-node-client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { stringToHex, toHex } from 'viem'
import Link from "next/link";
import { simulateContract } from "@wagmi/core";
import { config } from "@/wagmi";
import { useRouter } from "next/navigation";

const IS_DEV = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

export function InvoiceForm({
  invoice = INVOICE_MOCK,
}: {
  invoice?: InvoiceData;
}) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: hash, writeContract, error } = useWriteContract();
  const { litNodeClient } = useLit();
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (error && error.message && error.message.length > 0)
      toast(error.message);
  }, [error]);

  useEffect(() => {
    if (hash && hash.length > 0)
      toast.success(`Invoice saved successfully`, {
        action: {
          label: "View explorer",
          onClick: () => {
            window.open(`https://basescan.org/tx/${hash}`, "_blank");
          },
        },
        duration: 10000,
      });
  }, [hash]);

  const [items, setItems] = useState<InvoiceDataItems[]>(
    invoice.items || [ITEM_MOCK]
  );

  const getItemsTotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      IS_DEV
        ? ITEM_MOCK
        : ({
            details: "",
            quantity: 0,
            rate: 0,
            amount: 0,
          } as InvoiceDataItems),
    ]);
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemQuantityChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Number(value),
              amount: Number(value) * item.rate,
            }
          : item
      )
    );
  };

  const handleItemRateChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, rate: Number(value), amount: Number(value) * item.rate }
          : item
      )
    );
  };

  const handleItemDetailsChange = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, details: value } : item))
    );
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected) {
      return toast("Please sign in to save the invoice.");
    }
    if (!litNodeClient) {
      return toast("Lit node client not found");
    }

    const formData = new FormData(e.currentTarget);
    const formValues: Record<string, string> = {};
    formData.forEach((value, key) => {
      formValues[key] = value.toString();
    });

    const total_unit = invoice.total_unit;
    const total = getItemsTotal();

    const invoiceData: InvoiceData = {
      invoice_number: formValues["invoice_number"],
      status: formValues["status"]
        ? (formValues["status"].toLowerCase() as InvoiceStatus)
        : "sent",
      total: total,
      total_unit: total_unit,
      client_display_name: formValues["client_display_name"],
      creation_date: formValues["creation_date"],
      items: items,
      due_date: formValues["due_date"] || "",
      customer_notes: formValues["customer_notes"] || "",
    };

    try {
      const accs = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "base",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address,
          },
        },
      ];

      const encryptRes = await encryptString(
        {
          accessControlConditions: accs,
          dataToEncrypt: JSON.stringify(invoiceData),
        },
        litNodeClient
      );

      console.log("✅ encryptRes:", encryptRes);

      writeContract({
        address:
          invoiceHeroConfig.address[
            chainId as keyof typeof invoiceHeroConfig.address
          ],
        abi: invoiceHeroConfig.abi,
        functionName: 'createInvoice',
        args: [stringToHex(encryptRes.ciphertext), stringToHex(encryptRes.dataToEncryptHash)],
        account: address
      })

    } catch (err) {
      console.error(err);
      toast.error((err as Error)?.message || 'Failed to save invoice')
    }

  }

  const handleDownloadWithoutSaving = async () => {
    const total_unit = invoice.total_unit
    const total = getItemsTotal()

    const invoiceData: InvoiceData = {
      invoice_number: (formRef.current?.elements.namedItem('invoice_number') as HTMLInputElement)?.value || '',
      status: (formRef.current?.elements.namedItem('status') as HTMLInputElement)?.value as InvoiceStatus || 'sent',
      total: total,
      total_unit: total_unit,
      client_display_name: (formRef.current?.elements.namedItem('client_display_name') as HTMLInputElement)?.value || '',
      creation_date: (formRef.current?.elements.namedItem('creation_date') as HTMLInputElement)?.value || '',
      items: items,
      due_date: (formRef.current?.elements.namedItem('due_date') as HTMLInputElement)?.value || '',
      customer_notes: (formRef.current?.elements.namedItem('customer_notes') as HTMLInputElement)?.value || ''
    }

    const hexData = toHex(JSON.stringify(invoiceData))
    window.open(`/invoice/${hexData}/download`, '_blank')
  }

  return (
    <form ref={formRef} onSubmit={handleFormSubmit} className="border-2 rounded-xl p-5 mt-8">
      <div className='flex w-full sm:space-x-4 sm:flex-row flex-col justify-between'>

        <div className="mb-6">
          <label
            htmlFor="client_display_name"
            className="block mb-2 text-sm font-medium text-gray-200 "
          >
            Client name <span className="text-red-900">*</span>
          </label>
          <input
            type="client_display_name"
            id="client_display_name"
            name="client_display_name"
            className="w-4/5 outline-none border-none border border-white/20 bg-white/20 px-2 py-2 rounded-xl text-white text-base shadow-md"
            placeholder="John Doe"
            required
            defaultValue={IS_DEV ? invoice.client_display_name : undefined}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="invoice_number"
            className="block mb-2 text-sm font-medium text-gray-200 "
          >
            Invoice Number <span className="text-red-900">*</span>
          </label>
          <input
            type="text"
            id="invoice_number"
            name="invoice_number"
            className="w-4/5 outline-none border-none border border-white/20 bg-white/20 px-5 py-2 rounded-xl  text-white text-base shadow-md"
            required
            defaultValue={IS_DEV ? invoice.invoice_number : undefined}
          />
        </div>

        <div className="mb-6 relative">
          <label
            htmlFor="creation_date"
            className="block mb-2 text-sm font-medium text-gray-200 "
          >
            Invoice date <span className="text-red-900">*</span>
          </label>
          <input
            type="date"
            id="creation_date"
            name="creation_date"
            className="w-4.5/5 outline-none border-none border border-white/20 bg-white/20 px-2 py-2 pl-10 rounded-xl text-white text-base shadow-md"
            placeholder="mm/dd/yyyy"
            required
            defaultValue={
              IS_DEV
                ? invoice.creation_date
                : new Date().toISOString().split("T")[0]
            }
          />
        </div>

        <div className="mb-6 relative">
          <label
            htmlFor="due_date"
            className="block mb-2 text-sm font-medium text-gray-200 "
          >
            Due date{" "}
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            className="w-4.5/5 outline-none border-none border border-white/20 bg-white/20 px-2 py-2 pl-10  rounded-xl text-white text-base shadow-md"
            placeholder="mm/dd/yyyy"
            defaultValue={IS_DEV ? invoice.due_date : undefined}
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="status"
          className="block mb-2 text-sm font-medium text-gray-200 "
        >
          Status
        </label>
        <select
          id="status"
          defaultValue={IS_DEV ? invoice.status : "draft"}
          name="status"
          className="w-2/5 outline-none border-none border border-white/20 bg-white/20 px-5 py-4  rounded-xl text-white text-base shadow-md"
        >
          {["draft", "sent", "paid"].map((status, index) => (
            <option key={index} value={status} className="text-black">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 relative bg-white shadow-md sm:rounded-lg overflow-hidden w-full outline-none border-none border border-white/20 bg-white/20 px-10 py-2 pl-10 rounded-xl text-white text-base">
        <div className="overflow-x-auto">
          {/* Items table */}
          <table className="w-full text-sm text-left text-gray-200">
            <thead className="text-sm text-gray-200 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 w-[300px] ">
                  ITEM DETAILS
                </th>
                <th scope="col" className="px-4 py-3 w-[100px] text-right">
                  QUANTITY
                </th>
                <th scope="col" className="px-4 py-3 w-[100px] text-right">
                  RATE
                </th>
                <th scope="col" className="px-4 py-3 w-[100px] text-right">
                  AMOUNT
                </th>
                <th scope="col" className="px-4 py-3 w-[40px] text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap"
                  >
                    <textarea
                      rows={2}
                      className="w-full outline-none border-none border border-white/20 bg-white/20 px-5 py-2 rounded-xl text-white text-base shadow-md"
                      placeholder="Software Development"
                      onChange={(e) =>
                        handleItemDetailsChange(index, e.target.value)
                      }
                      required
                      defaultValue={IS_DEV ? item.details : undefined}
                    ></textarea>
                  </th>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      onChange={(e) =>
                        handleItemQuantityChange(index, e.target.value)
                      }
                      className="w-full outline-none border-none border border-white/20 bg-white/20  py-3 text-center rounded-xl text-white text-base shadow-md"
                      step="1"
                      placeholder="0.00"
                      required
                      defaultValue={IS_DEV ? item.quantity : undefined}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      onChange={(e) =>
                        handleItemRateChange(index, e.target.value)
                      }
                      className="w-full outline-none border-none border border-white/20 bg-white/20 py-3 text-center rounded-xl text-white text-base shadow-md"
                      step="1"
                      placeholder="0.00"
                      required
                      defaultValue={IS_DEV ? item.rate : undefined}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-block p-2.5 font-bold">
                      {formatAmount(
                        item.quantity * item.rate,
                        invoice.total_unit
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center justify-end">
                    {index > 0 && (
                      <button
                        onClick={() => handleDeleteItem(index)}
                        id={`rm-item-${index}`}
                        type="button"
                        className="py-2.5 m-0 bg-transparent flex"
                        aria-label="Remove item"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                        Remove Item
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <button
            onClick={handleAddItem}
            type="button"
            aria-label="Add item"
            className="flex items-center justify-center  bg-primary-700 hover:bg-primary-800  font-medium rounded-lg text-sm px-4 py-2 "
          >
            <svg
              className="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <table className="w-[50%] text-sm text-left text-gray-500 mt-4">
          <tbody>
            <tr className="border-b">
              <th
                scope="row"
                className="px-4 py-3 font-medium text-gray-200 whitespace-nowrap"
              >
                Total
              </th>
              <td className="px-4 py-3 text-right text-gray-300">
                {formatAmount(getItemsTotal(), invoice.total_unit)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <label
          htmlFor="Customer Notes"
          className="block mb-2 text-sm font-medium text-gray-200 "
        >
          Customer Notes
        </label>
        <textarea
          id="customer_notes"
          name="customer_notes"
          rows={4}
          className="w-full outline-none border-none border border-white/20 bg-white/20 px-5 py-2  rounded-xl text-white text-base shadow-md"
          placeholder={invoice.customer_notes}
          defaultValue={IS_DEV ? invoice.customer_notes : undefined}
        ></textarea>
      </div>

      <div className="w-full  flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleDownloadWithoutSaving()}
          type="button"
          name="download"
          className="relative inline-flex h-12 mt-4 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-10 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Download
          </span>
        </button>

        <div>
          <button
            disabled={!isConnected}
            type="submit"
            name="save"
            className="relative inline-flex h-12 mt-4 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-10 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Save Invoice
            </span>
          </button>
        </div>
      </div>
      <div className="font-medium w-full text-center">
        {
          !isConnected ? (
            <span >Please <Link href="/">sign in</Link> to save the invoice.</span>
          ) : (
              <span >This invoice will be saved to your account, would cost you a small fee, to store it on the blockchain forever.</span>
          )
        }
      </div>
    </form>
  );
}
