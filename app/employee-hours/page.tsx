"use client";

import * as z from "zod";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must have at least 2 characters.",
  }),
  startTime: z.string().transform((val) => Number(val)),
  endTime: z.string().transform((val) => Number(val)),
  hourlyRate: z.string().transform((val) => Number(val)),
  days: z.string().transform((val) => Number(val)),
});

function EmployeeInputs({ onSubmit }: any) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      startTime: 0.0,
      endTime: 0.0,
      hourlyRate: 0.0,
      days: 1,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        className='w-2/3 flex flex-col space-y-6 mb-10'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='w-full max-w-lg mx-auto items-center'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Employee name' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='startTime'
          render={({ field }) => (
            <FormItem className='w-full max-w-lg mx-auto items-center'>
              <FormLabel>start time:</FormLabel>
              <FormControl>
                <Input
                  placeholder='ex: 8'
                  type='number'
                  step='0.01'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='endTime'
          render={({ field }) => (
            <FormItem className='w-full max-w-lg mx-auto items-center'>
              <FormLabel>end time:</FormLabel>
              <FormControl>
                <Input
                  placeholder='ex: 18'
                  type='number'
                  step='0.01'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='days'
          render={({ field }) => (
            <FormItem className='w-full max-w-lg mx-auto items-center'>
              <FormLabel>days:</FormLabel>
              <FormControl>
                <Input
                  placeholder='ex: 18'
                  type='number'
                  step='0.01'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='hourlyRate'
          render={({ field }) => (
            <FormItem className='w-full max-w-lg mx-auto items-center'>
              <FormLabel>Hourly Rate:</FormLabel>
              <FormControl>
                <Input
                  placeholder='ex: 20'
                  type='number'
                  step='0.01'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full items-center mx-auto max-w-lg' type='submit'>
          Add employee hours
        </Button>
      </form>
    </Form>
  );
}

function EmployeeHours() {
  const [showForm, setShowForm] = React.useState(false);
  const [tableData, setTableData] = React.useState<Object[]>([]);

  useEffect(() => {
    const storedTableData = JSON.parse(
      localStorage.getItem("tableData") || "[]"
    );
    if (storedTableData.length) {
      setTableData(storedTableData);
    }
  }, []);

  const handleSubmit = (data: any) => {
    const { name, startTime, endTime, hourlyRate, days } = data;
    const totalHours = (Number(endTime) - Number(startTime)) * days;
    const totalCompensation = totalHours * Number(hourlyRate) || 0;

    const updatedTableData = [
      ...tableData,
      { ...data, totalHours, totalCompensation },
    ];

    localStorage.setItem("tableData", JSON.stringify(updatedTableData));
    setTableData(updatedTableData);
    setShowForm(false);
    toast({
      title: `Employee: ${name} hours added!`,
    });
  };

  const handleDelete = (index: number) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);

    localStorage.setItem("tableData", JSON.stringify(updatedTableData));
    setTableData(updatedTableData);
  };

  return (
    <div className='container mx-auto flex flex-col items-center justify-around min-h-screen py-2'>
      <h1 className='text-6xl font-bold mb-3'>Employee Hours</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-12'>
          Add Employee Hours
        </button>
      )}

      {showForm && <EmployeeInputs onSubmit={handleSubmit} />}

      {tableData.length > 0 && (
        <EmployeeTable data={tableData} onDelete={handleDelete} />
      )}
    </div>
  );
}

function EmployeeTable({ data, onDelete }: { data: any; onDelete: any }) {
  const [totalCompensation, setTotalCompensation] = React.useState(0);

  useEffect(() => {
    console.log(data);
    const newTotalCompensation = data.reduce(
      (sum: number, employee: { totalCompensation: number }) =>
        sum + employee.totalCompensation,
      0
    );
    setTotalCompensation(newTotalCompensation);
  }, [data]);

  return (
    <>
      <table className='table-auto min-w-full border-b border-gray-300'>
        <thead>
          <tr>
            <th className='py-2 px-4 border'>Name</th>
            <th className='py-2 px-4 border'>Start Time</th>
            <th className='py-2 px-4 border'>End Time</th>
            <th className='py-2 px-4 border'>Hourly Rate</th>
            <th className='py-2 px-4 border'>Total Hours</th>
            <th className='py-2 px-4 border'>Total Compensation</th>
            <th className='py-2 px-4 border'>Delete Entry</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee: any, index: number) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className='py-2 px-4 border'>{employee.name} </td>
              <td className='py-2 px-4 border'>{employee.startTime} </td>
              <td className='py-2 px-4 border'>{employee.endTime} </td>
              <td className='py-2 px-4 border'>{employee.hourlyRate} </td>
              <td className='py-2 px-4 border'>{employee.totalHours} </td>
              <td className='py-2 px-4 border'>
                {employee.totalCompensation}{" "}
              </td>
              <td className='py-2 px-4 border'>
                <button
                  onClick={() => onDelete(index)}
                  className='text-red-600 hover:text-red-800'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-4 text-xl font-bold'>
        Total Compensation: $ {totalCompensation}
      </div>
    </>
  );
}

export default EmployeeHours;
