<template>
  <div style="width: 450px; margin: 0 auto">
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="150"
    >
      <FormItem label="Phone No." prop="phone">
        <Input
          v-model="formValidate.phone"
          placeholder="Enter your phone no"
        ></Input>
      </FormItem>

      <FormItem label="Password" prop="passwd">
        <Input
          type="password"
          v-model="formValidate.passwd"
          placeholder="Enter password"
        ></Input>
      </FormItem>

      <FormItem label="Confirm Password" prop="passwdCheck">
        <Input
          type="password"
          v-model="formValidate.passwdCheck"
          placeholder="Confirm password"
        ></Input>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')"
          >Submit</Button
        >
        <Button @click="handleReset('formValidate')" style="margin-left: 8px"
          >Reset</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
const axios = require("axios").default;

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      const phRegex = /^(?:\+?88)?01[13-9]\d{8}$/;
      if (value === "") {
        callback(new Error("Please enter your phone number"));
      } else if (!phRegex.test(value)) {
        callback(new Error("Phone number is not valid!"));
      } else {
        callback();
      }
    };

    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else if (value.length < 8) {
        callback(new Error("Password must be at least 8 characters"));
      } else {
        if (this.formValidate.passwdCheck !== "") {
          this.$refs.formValidate.validateField("passwdCheck");
        }
        callback();
      }
    };

    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.formValidate.passwd) {
        callback(new Error("Passwords do not match!"));
      } else {
        callback();
      }
    };

    return {
      formValidate: {
        phone: "",
        passwd: "",
        passwdCheck: "",
      },

      ruleValidate: {
        phone: [
          {
            validator: validatePhone,
            trigger: "blur",
          },
        ],
        passwd: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }],
      },
    };
  },

  methods: {
    handleSubmit(formRef) {
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          axios
            .post(`http://127.0.0.1:3000/signup`, this.formValidate, {
              withCredentials: true,
              credentials: "include",
            })
            .then((response) => {
              if (response.data.status == "success") {
                this.$Message.success("User Registered");
                this.handleReset(formRef);
              }
            })
            .catch((error) => {
              if (error.response.data.message.errors.phone) {
                this.$Message.error(
                  error.response.data.message.errors.phone.message
                );
              }
            });
        } else {
          this.$Message.error("Please check all the inputs!");
        }
      });
    },

    handleReset(formRef) {
      this.$refs[formRef].resetFields();
    },
  },
};
</script>
