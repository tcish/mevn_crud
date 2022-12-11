<template>
  <div>
    <HeaderLink />

    <div style="width: 400px; margin: 0 auto">
      <Form ref="form" :model="form" :rules="ruleValidate">
        <FormItem label="Name" prop="name">
          <Input v-model="form.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="E-mail" prop="email">
          <Input v-model="form.email" placeholder="Enter your e-mail"></Input>
        </FormItem>
        <FormItem label="Address" prop="address">
          <Input
            v-model="form.address"
            placeholder="Enter your address"
          ></Input>
        </FormItem>

        <template v-for="(item, i) in form.skills">
          <FormItem
            v-if="item.status"
            :key="i"
            label="Skill"
            :prop="'skills.' + i + '.value'"
            :rules="{
              required: true,
              message: 'Skill can not be empty',
              trigger: 'blur',
            }"
          >
            <Row>
              <Col span="18">
                <Input
                  type="text"
                  v-model="item.value"
                  placeholder="Enter your skill"
                ></Input>
              </Col>
              <Col span="4" offset="1">
                <Button @click="handleRemove(i)">Delete</Button>
              </Col>
            </Row>
          </FormItem>
        </template>
        <FormItem>
          <Row>
            <Col span="12">
              <Button type="dashed" long @click="handleAdd" icon="md-add"
                >Add item</Button
              >
            </Col>
          </Row>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('form')">Submit</Button>
          <Button @click="handleReset('form')" style="margin-left: 8px"
            >Reset</Button
          >
        </FormItem>
      </Form>
    </div>
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
      index: 1,
      form: {
        name: "",
        email: "",
        address: "",
        skills: [
          {
            value: "",
            index: 1,
            status: 1,
          },
        ],
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
      },
    };
  },
  methods: {
    handleSubmit(formRefName) {
      this.$refs[formRefName].validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form));
          axios
            .post("http://127.0.0.1:3000/create", data, {
              withCredentials: true,
            })
            .then((response) => {
              this.$Message.success("Inserted Successfully!");
              this.handleReset(formRefName);
              this.$router.push("/");
            })
            .catch((error) => {
              if (error.response.data.message) {
                this.$Message.error(error.response.data.message);
              }
            });
        } else {
          this.$Message.error("Please check all the inputs!");
        }
      });
    },

    handleAdd() {
      this.index++;
      this.form.skills.push({
        value: "",
        index: this.index,
        status: 1,
      });
    },

    handleRemove(index) {
      this.form.skills[index].status = 0;
    },

    handleReset(formRefName) {
      this.$refs[formRefName].resetFields();
    },
  },
};
</script>
