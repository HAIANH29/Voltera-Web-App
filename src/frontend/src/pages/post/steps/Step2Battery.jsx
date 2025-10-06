import React from "react";
import { Form, InputNumber, Input, Button, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useVehiclePost } from "../useVehiclePost";

export default function Step2Battery() {
  const { data } = useVehiclePost().state;
  const { patch, next, prev } = useVehiclePost();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    patch(values);
    next();
  };

  return (
    <div className="p-5 rounded-2xl border bg-white shadow-sm">
      <div className="text-lg font-semibold mb-4">Battery Information</div>

      <Form form={form} layout="vertical" initialValues={data} onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="batteryCapacity" label="Battery Capacity (kWh)" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} placeholder="75" />
          </Form.Item>

          <Form.Item name="batteryHealth" label="Battery Health (%)" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} max={100} placeholder="94" />
          </Form.Item>

          <Form.Item name="maxChargeSpeed" label="Max Charging Speed (kW)">
            <InputNumber className="w-full" min={0} placeholder="250" />
          </Form.Item>

          <Form.Item name="warrantyRemaining" label="Warranty Remaining">
            <Input placeholder="18 months" />
          </Form.Item>
        </div>

        {/* Certificate box */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-4">
          <div className="font-medium mb-2">Battery Health Certificate</div>
          <p className="text-sm text-gray-600 mb-3">
            We recommend getting a professional battery health assessment to increase buyer confidence.
            Verified battery reports can increase your listing value by up to 15%.
          </p>

          <Form.Item name="batteryReportFile" valuePropName="fileList" getValueFromEvent={(e)=>e?.fileList}>
            <Upload.Dragger multiple={false} maxCount={1} beforeUpload={() => false}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Upload Battery Report</p>
              <p className="ant-upload-hint">PDF, PNG, JPG up to 10MB</p>
            </Upload.Dragger>
          </Form.Item>
        </div>

        <div className="flex justify-between">
          <Button onClick={prev}>Previous</Button>
          <Button type="primary" htmlType="submit">Next</Button>
        </div>
      </Form>
    </div>
  );
}
