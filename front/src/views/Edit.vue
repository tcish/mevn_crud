<template>
  <div style="width: 400px; margin: 0 auto">
    <Form ref="form" :model="form" :rules="ruleValidate">
      <FormItem label="Name" prop="name">
        <Input v-model="form.name" placeholder="Enter your name"></Input>
      </FormItem>

      <FormItem label="E-mail" prop="email">
        <Input v-model="form.email" placeholder="Enter your e-mail"></Input>
      </FormItem>

      <FormItem label="Address" prop="address">
        <Input v-model="form.address" placeholder="Enter your address"></Input>
      </FormItem>

      <FormItem label="Skills" prop="skill">
        <Input v-model="form.skill" placeholder="Enter your skill"></Input>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="handleSubmit('form')">Submit</Button>
        <Button @click="handleReset('form')" style="margin-left: 8px"
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
    return {
      form: {
        name: "",
        email: "",
        address: "",
        skill: "",
      },

      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty!",
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
        address: [
          {
            required: true,
            message: "Address cannot be empty!",
            trigger: "blur",
          },
        ],
        skill: [
          {
            required: true,
            message: "Skills cannot be empty!",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getOneData() {
      const id = this.$route.params.id;
      axios
        .get(`http://127.0.0.1:3000/read-one/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          this.form = response.data.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // const data = JSON.parse(JSON.stringify(this.form));
          const id = this.$route.params.id;
          axios
            .post(`http://127.0.0.1:3000/update-data/${id}`, this.form, {
              withCredentials: true,
            })
            .then((response) => {
              this.$Message.success("Updated Successfully!");
              this.handleReset(form);
              this.$router.push("/");
            })
            .catch((error) => {
              if (error.response.data.message.errors.email) {
                this.$Message.error(
                  error.response.data.message.errors.email.message
                );
              }
            });
        } else {
          this.$Message.error("Please check all the inputs!");
        }
      });
    },

    handleReset(form) {
      this.$refs[form].resetFields();
    },
  },

  created() {
    this.getOneData();
  },
};
</script>
