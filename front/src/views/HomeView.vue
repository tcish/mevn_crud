<template>
  <div class="main">
    <HeaderLink />

    <Table stripe border height="auto" :columns="columns" :data="data">
      <template #action="{ row }">
        <router-link :to="'/edit/' + row._id">
          <Button type="primary" size="small" style="margin-right: 5px"
            >Edit</Button
          >
        </router-link>
        <Button type="error" size="small" @click="remove(row._id)"
          >Delete</Button
        >
      </template>
    </Table>
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
      columns: [
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "Name",
          key: "name",
          align: "center",
        },
        {
          title: "Email",
          key: "email",
          align: "center",
        },
        {
          title: "Address",
          key: "address",
          align: "center",
        },
        {
          title: "Skill",
          type: "expand",
          align: "center",
          width: 150,
          render: (h, { row: { skill } }) => {
            skill.forEach((el) => {
              return h('span' + el.skill + ', ');
            });
          },
        },
        {
          title: "Action",
          slot: "action",
          align: "center",
        },
      ],

      data: null,
    };
  },

  methods: {
    async getData() {
      await axios
        .get("http://127.0.0.1:3000/read", {
          withCredentials: true,
        })
        .then((response) => {
          this.data = response.data.data.datas;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status == "fail") {
            this.$Message.error(error.response.data.message);
          }
        });
    },

    async remove(id) {
      await axios
        .delete(`http://127.0.0.1:3000/delete-data/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status == "success") {
            this.$Message.success("Deleted Successfully");
            this.getData();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  created() {
    this.getData();
  },
};
</script>

<style scoped>
.main {
  margin: 0 3rem;
}
</style>
