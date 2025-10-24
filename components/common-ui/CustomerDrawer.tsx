import React, {useState} from 'react';
import * as Yup from 'yup';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {Formik, Form} from "formik";
import {Button} from "@/components/ui/button";
import {Loader2, Phone, UserRound, X} from "lucide-react";
import CustomInputFieldWithIcon from "@/components/common-ui/CustomInputFieldWithIcon";
import {useUser} from "@/components/context/AuthContext";
import Image from "next/image";

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
});

function CustomerDrawer({open = false, setOpen}) {
    const {login} = useUser();
    const [loading,setLoading] = useState<boolean>(false);

    const initialValues = {firstName: '', lastName: '', phoneNumber: ''};

    const onSubmit = async (values: any) => {
      setLoading(true);
      try {
        const result = await login(values);
        if (result.success) {
          setOpen(false);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    return (
        <Drawer open={open} onClose={setOpen}>
            <DrawerContent>
                <DrawerClose
                    className="absolute right-2 top-2 rounded-full bg-primary text-white border font-semibold z-99">
                    <X size={18}/>
                </DrawerClose>

                <DrawerHeader>
                    <DrawerTitle className="text-2xl text-start border-b-2 flex flex-col gap-2 z-99">
                        <span>Customer Information</span>
                        <div className="h-[0.1px] w-full bg-card"></div>
                    </DrawerTitle>
                </DrawerHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    <Form className="px-6 flex flex-col gap-5 pb-34 z-99">
                        <CustomInputFieldWithIcon
                            placeholder="Enter first name"
                            name="firstName"
                            type="text"
                            icon={<UserRound size={18}/>}
                        />
                        <CustomInputFieldWithIcon
                            placeholder="Enter last name"
                            name="lastName"
                            type="text"
                            icon={<UserRound size={18}/>}
                        />
                        <CustomInputFieldWithIcon
                            placeholder="Enter mobile number"
                            name="phoneNumber"
                            type="phone"
                            icon={<Phone size={16}/>}
                        />
                        <Button type="submit" className="h-12 rounded-xl text-white text-lg" disabled={loading}>
                          { loading ? (
                              <span className="animate-spin ml-2">
                                <Loader2/>
                              </span>
                          ) : (
                            <span>Submit</span>
                          ) }
                        </Button>
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

export default CustomerDrawer;
