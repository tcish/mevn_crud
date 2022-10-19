<template>
  <div class="main">
    <Table stripe border height="auto" :columns="columns" :data="data">
      <template #action="{ row }">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="show(row._id)"
          >Edit</Button
        >
        <Button type="error" size="small" @click="remove(row._id)"
          >Delete</Button
        >
      </template>
    </Table>
  </div>
</template>
<script>
const axios = require("axios").default;

export default {
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
          key: "skill",
          align: "center",
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
        .get("http://127.0.0.1:3000/read")
        .then((response) => {
          this.data = response.data.data.datas;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async remove(id) {
      await axios
        .delete(`http://127.0.0.1:3000/delete-data/${id}`)
        .then((response) => {
          console.log(response);
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
