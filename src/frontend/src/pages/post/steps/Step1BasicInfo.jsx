import React from "react";
import { Form, Input, Select, InputNumber, Button } from "antd";
import { useVehiclePost } from "../vehicles/useVehiclePost";
import { BRANDS, MODELS, YEARS, CONDITIONS } from "../../../config/vehicleOptions";

export default function Step1BasicInfo() {
  const { data } = useVehiclePost().state;
  const { patch, next, prev } = useVehiclePost();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    patch(values);
    next();
  };

  return (
    <div className="p-5 rounded-2xl border bg-white shadow-sm">
      <div className="text-lg font-semibold mb-4">Basic Information</div>
      <Form
        form={form}
        layout="vertical"
        initialValues={data}
        onFinish={onFinish}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="title" label="Listing Title" rules={[{ required: true, message: "Enter a title" }]}>
            <Input placeholder="2021 Tesla Model 3 Long Range" />
          </Form.Item>

          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Select options={BRANDS.map(b => ({ label: b, value: b }))} placeholder="Select brand" />
          </Form.Item>

          <Form.Item name="model" label="Model" rules={[{ required: true }]}>
            <Select options={MODELS.map(m => ({ label: m, value: m }))} placeholder="Select model" showSearch />
          </Form.Item>

          <Form.Item name="year" label="Year" rules={[{ required: true }]}>
            <Select options={YEARS.map(y => ({ label: y, value: y }))} placeholder="Select year" />
          </Form.Item>

          <Form.Item name="condition" label="Condition" rules={[{ required: true }]}>
            <Select options={CONDITIONS} placeholder="Select condition" />
          </Form.Item>

          <Form.Item name="mileage" label="Mileage (mi)" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} placeholder="25000" />
          </Form.Item>

          <Form.Item name="description" label="Description" className="md:col-span-2" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Provide a detailed description..." />
          </Form.Item>
        </div>

        <div className="flex justify-between mt-2">
          <Button onClick={prev}>Previous</Button>
          <Button type="primary" htmlType="submit">Next</Button>
        </div>
      </Form>
    </div>
  );
}
