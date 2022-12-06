<template>
  <div>
    <HeaderLink />

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
      <div class="auto-login">
        <Checkbox
          v-model="signin.rememberMe"
          value="true"
          v-if="signin.rememberMe ? 'selected' : 'unselected'"
          >Remember me</Checkbox
        >
        <a @click.prevent="fPassModal = true">Forgot Password?</a>
      </div>
      <FormItem>
        <Button type="primary" @click="handleSubmit('signinForm')"
          >Login</Button
        >
      </FormItem>
    </Form>

    <!-- popup modal -->
    <Modal
      title="Forgot password?"
      v-model="fPassModal"
      :styles="{ top: '20px' }"
    >
      <Form
        ref="fPassFrom"
        :rules="fPassFromRules"
        :model="fPassFrom"
        :label-width="100"
        style="width: 380px; margin: 0 auto"
      >
        <FormItem label="Phone No." prop="phone">
          <Input
            v-model="fPassFrom.phone"
            placeholder="Enter your phone no"
          ></Input>
        </FormItem>

        <FormItem label="E-mail" prop="email">
          <Input
            v-model="fPassFrom.email"
            placeholder="Enter your e-mail"
          ></Input>
        </FormItem>
      </Form>

      <template #footer>
        <Button type="text" @click="fPassModal = false">Cancel</Button>
        <Button type="info" @click="handelFPassModal('fPassFrom')"
          >Send<Icon type="ios-send"
        /></Button>
      </template>
    </Modal>
  </div>
</template>
<script>
const axios = require("axios").default;
import HeaderLink from "./component/HeaderLink.vue";

export default {
  components: {
    HeaderLink,
  },

  data() {
    return {
      signin: {
        phone: "",
        password: "",
        rememberMe: null,
      },

      fPassModal: false,

      fPassFrom: {
        phone: "",
        email: "",
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

      fPassFromRules: {
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
        email: [
          {
            required: true,
            message: "E-mail cannot be empty!",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Incorrect email format!",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.chkRemember();
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

    chkRemember() {
      axios
        .get(`http://127.0.0.1:3000/chk-remember`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response && response.data.status == "success") {
            this.signin.phone = response.data.data.phone;
            this.signin.password = response.data.data.passwd;
            this.signin.rememberMe = true;
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status == "fail") {
            this.$Message.error(error.response.data.message);
          }
        });
    },

    handelFPassModal(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          axios
            .post(`http://127.0.0.1:3000/forgotPassword`, this.fPassFrom)
            .then((response) => {
              if (response.data.status == "success") {
                this.$Message.info(response.data.message);
                this.fPassModal = false;
                this.$refs[name].resetFields();
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
  },
};
</script>

<style scoped>
.auto-login {
  margin-bottom: 24px;
  text-align: left;
}
.auto-login a {
  float: right;
}
.auto-login a {
  float: right;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
.vertical-center-modal .ivu-modal {
  top: 0;
}
</style>