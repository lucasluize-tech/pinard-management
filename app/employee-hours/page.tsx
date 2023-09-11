"use client";

import * as z from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
      startTime: 0,
      endTime: 0,
      hourlyRate: 0,
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
                <Input placeholder='ex: 8' type='number' {...field} />
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
                <Input placeholder='ex: 18' type='number' {...field} />
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
                <Input placeholder='ex: 18' type='number' {...field} />
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
                <Input placeholder='ex: 20' type='number' {...field} />
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
  const [tableData, setTableData] = React.useState([{}]);

  const handleSubmit = (data: any) => {
    const { startTime, endTime, hourlyRate, days } = data;
    const totalHours = (Number(endTime) - Number(startTime)) * days;
    const totalCompensation = totalHours * Number(hourlyRate);
    setTableData([
      ...tableData,
      {
        ...data,
        totalHours,
        totalCompensation,
      },
    ]);
    setShowForm(false);
  };

  return (
    <div className='container mx-auto flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-6xl font-bold mb-3'>Employee Hours</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-12'>
          Add Employee Hours
        </button>
      )}

      {showForm && <EmployeeInputs onSubmit={handleSubmit} />}

      {tableData && <EmployeeTable data={tableData} />}
    </div>
  );
}

function EmployeeTable({ data }: any) {
  const totalCompensation = data.reduce(
    (sum: any, employee: any) => sum + employee.totalCompensation,
    0
  );

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
          </tr>
        </thead>
        <tbody>
          {data.map((employee: any, index: number) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className='py-2 px-4 border'>{employee.name}</td>
              <td className='py-2 px-4 border'>{employee.startTime}</td>
              <td className='py-2 px-4 border'>{employee.endTime}</td>
              <td className='py-2 px-4 border'>{employee.hourlyRate}</td>
              <td className='py-2 px-4 border'>{employee.totalHours}</td>
              <td className='py-2 px-4 border'>{employee.totalCompensation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-4 text-xl font-bold'>
        Total Compensation: ${totalCompensation || 0}
      </div>
    </>
  );
}

export default EmployeeHours;
