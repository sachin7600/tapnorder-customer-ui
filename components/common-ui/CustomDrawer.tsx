import React from 'react';
import * as Yup from 'yup';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "@/components/ui/button";
import {Phone, UserRound, X} from "lucide-react";
import CustomInputFieldWithIcon from "@/components/common-ui/CustomInputFieldWithIcon";
import Image from "next/image";
import {useCustomerLoginMutation} from "@/lib/api/CustomerApi";
import {useSearchParams} from "next/navigation";
import {toast} from "sonner";

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
  });

function CustomDrawer({open = false, setOpen}) {
  const initialValues = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
  };
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outletId");
  const [customerLogin] = useCustomerLoginMutation();

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        outletId
      }

      const res = await customerLogin(payload).unwrap();
      if(res.succeeded) {
        setOpen(false);
        toast.success(res.message, {
          position: "top-center",
        });
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("customerLogin", JSON.stringify(res.data));
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", {
        position: "top-center",
      });
    }
  };

  return (
    <Drawer open={open} onClose={setOpen}>
      <DrawerContent>
        <DrawerClose className={'absolute right-2 top-2 rounded-full bg-primary text-white border font-semibold z-99'}><X size={18}/></DrawerClose>
        <DrawerHeader>
          <DrawerTitle className={'text-2xl text-start border-b-2 flex flex-col gap-2 z-99'}>
            <span>Customer Information</span>
            <div className={'h-[0.1px] w-full bg-card'}></div>
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className={'px-6 flex flex-col gap-5 pb-34 z-99'}>
              <CustomInputFieldWithIcon placeholder={'Enter first name'} name="firstName" type="text" icon={<UserRound size={18}/>}/>
              <CustomInputFieldWithIcon placeholder={'Enter last name'} name="lastName" type="text" icon={<UserRound size={18}/>}/>
              <CustomInputFieldWithIcon placeholder={'Enter mobile number'} name="phoneNumber" type="phone" icon={<Phone size={16}/>}/>
            <Button type="submit" className={'h-12 rounded-xl text-white text-lg'}>Submit</Button>
          </Form>
        </Formik>
        <div>
          <Image
            src={'/Images/form_img.jpg'}
            alt={'bg-image'}
            fill
            priority
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CustomDrawer;
