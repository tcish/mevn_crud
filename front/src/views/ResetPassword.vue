<template>
  <div style="width: 450px; margin: 60px auto">
    <h1 style="margin-bottom: 25px">Reset Password</h1>
    <Form
      ref="passResetform"
      :model="passResetform"
      :rules="ruleValidate"
      :label-width="165"
    >
      <FormItem label="New Password" prop="newPass">
        <Input
          type="password"
          v-model="passResetform.newPass"
          placeholder="Enter new password"
        ></Input>
      </FormItem>
      <FormItem label="Confirm New Password" prop="newPassChk">
        <Input
          type="password"
          v-model="passResetform.newPassChk"
          placeholder="Confirm new password"
        ></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('passResetform')"
          >Update</Button
        >
        <Button @click="handleReset('passResetform')" style="margin-left: 8px"
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
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your new password"));
      } else if (value.length < 8) {
        callback(new Error("Password must be at least 8 characters"));
      } else {
        if (this.passResetform.newPassChk !== "") {
          this.$refs.passResetform.validateField("newPassChk");
        }
        callback();
      }
    };

    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your new password again"));
      } else if (value !== this.passResetform.newPass) {
        callback(new Error("New passwords do not match!"));
      } else {
        callback();
      }
    };

    return {
      passResetform: {
        newPass: "",
        newPassChk: "",
      },

      ruleValidate: {
        newPass: [{ validator: validatePass, trigger: "blur" }],
        newPassChk: [{ validator: validatePassCheck, trigger: "blur" }],
      },
    };
  },

  methods: {
    handleSubmit(formRef) {
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          const token = this.$route.params.token;

          axios
            .patch(
              `http://127.0.0.1:3000/resetPassword/${token}`,
              this.passResetform,
              {
                withCredentials: true,
                credentials: "include",
              }
            )
            .then((response) => {
              console.log(response);
              if (response.data.status == "success") {
                this.$Message.info(response.data.message);
                this.$router.push("/home");
              }
            })
            .catch((error) => {
              console.log(error);
              if (error.response.data.status == "fail") {
                this.$Message.error(error.response.data.message);
              }
            });
        }
      });
    },

    handleReset(formRef) {
      this.$refs[formRef].resetFields();
    },
  },
};
</script>