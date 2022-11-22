<template>
  <Form
    ref="signinForm"
    :rules="rules"
    :model="signin"
    style="width: 300px; margin: 0 auto"
  >
    <FormItem prop="phone">
      <Input type="text" v-model="signin.phone" placeholder="Enter phone">
        <template #prepend>
          <Icon type="ios-call-outline" />
        </template>
      </Input>
    </FormItem>

    <FormItem prop="password">
      <Input
        type="password"
        v-model="signin.password"
        placeholder="Enter password"
      >
        <template #prepend>
          <Icon type="ios-lock-outline" />
        </template>
      </Input>
    </FormItem>

    <FormItem>
      <Button type="primary" @click="handleSubmit('signinForm')">Signin</Button>
    </FormItem>
  </Form>
</template>
<script>
const axios = require("axios").default;

export default {
  data() {
    return {
      signin: {
        phone: "",
        password: "",
      },

      rules: {
        phone: [
          {
            required: true,
            message: "No phone number is given",
            trigger: "blur",
          },
          {
            pattern: /^(?:\+?88)?01[13-9]\d{8}$/,
            message: "Given number is no valid",
            trigger: "blur",
          },
        ],

        password: [
          {
            required: true,
            message: "No password is given.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 8,
            message: "The password length cannot be less than 8 characters",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          axios
            .post(`http://127.0.0.1:3000/signin`, this.signin, {
              withCredentials: true,
              credentials: "include",
            })
            .then((response) => {
              if (response && response.data.status == "success") {
                this.handleReset(name);
                this.$router.push("/home");
              }
            })
            .catch((error) => {
              console.log(error);
              if (error && error.response.data.status == "fail") {
                this.$Message.error(error.response.data.message);
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
