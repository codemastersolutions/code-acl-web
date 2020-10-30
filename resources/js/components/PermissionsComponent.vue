<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header">
                        Permissões

                        <div class="card-header-actions">
                            <button class="btn btn-sm btn-square btn-primary" type="button" @click="newPermission()">
                                Nova permissão
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-responsive-sm table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th class="text-center">Inclusão</th>
                                <th class="text-center">Alteração</th>
                                <th class="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="permission in permissions" :key="permission.id">
                                <td>{{permission.name}}</td>
                                <td class="text-center">{{permission.created_at.date}}</td>
                                <td class="text-center">{{permission.updated_at.date}}</td>
                                <td class="text-center">
                                    <span class="pointer" data-id="permission.id" @click="editPermission(permission)" title="Editar esta permissão">
                                        <i class="c-icon cil-pencil text-primary"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="deletePermission(permission)" title="Exluir esta permissão">
                                        <i class="c-icon cil-trash text-danger"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="permissionRoles(permission.id)" title="Papéis que possuem esta permissão">
                                        <i class="c-icon cil-notes text-dark"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="permissionUsers(permission.id)" title="Usuários que possuem esta permissão">
                                        <i class="c-icon cil-people text-info"></i>
                                    </span>
                                    |
                                    <span class="pointer" @click="permissionTokens(permission.id)" title="Tokens que possuem esta permissão">
                                        <i class="c-icon cil-lock-locked text-success"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                        <ul class="pagination pagination-sm">
                            <li class="page-item"><a class="page-link" href="#">Anterior</a></li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">Próxima</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalPermission" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="display: none;" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content flat">
                    <div class="modal-header">
                        <h4 class="modal-title">{{modalTitle}}</h4>
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="editMode ? updatePermission() : createPermission()">
                            <div class="form-group">
                                <label for="name">Nome da Permissão</label>
                                <input class="form-control flat" name="name" id="name" type="text" placeholder="Informe um nome para a permissão"
                                v-model="form.name"/>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button v-show="editMode" class="btn btn-block btn-square" type="submit"
                            :class="{ 'btn-primary': editMode }">
                            Atualizar
                        </button>
                        <button v-show="!editMode" class="btn btn-success btn-block btn-square" type="submit"
                            :class="{ 'btn-success': !editMode }">
                            Salvar
                        </button>
                        <button class="btn btn-secondary btn-block btn-square" type="button" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'permissions',
        data() {
            return {
                editMode: false,
                modalTitle: '',
                form: new Form({
                    name : ''
                }),
                permissions: [{
                    id: 1,
                    name: 'John Doe',
                    created_at: {
                        date: 'created_at'
                    },
                    updated_at: {
                        date: 'updated_at'
                    }
                }],
            }
        },
        mounted() {
            SwalSuccess.fire({ title: 'Permissão excluída com sucesso!' });

            // this.deletePermission(this.permissions[0]);
        },
        methods: {
            deletePermission(permission) {
                SwalQuestion.fire({
                    title: `Confirma a exclusão da permissão ${permission.name}?`
                }).then((result) => {
                    if (result.value) {
                        this.form.delete(`api/code-acl/${permission.id}`)
                            .then((response)=> {
                                Swal.fire('Permissão excluída com sucesso!', '', 'success');
                            // this.loadUsers();

                            }).catch((error) => {
                                console.log(error);

                                Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Algo saiu errado!',
                                footer: error
                                })
                            })
                        }

                });
            },
            editPermission(permission) {
                this.form.clear();
                this.form.reset();
                this.editMode = true
                this.modalTitle = 'Editar permissão';
                this.form.fill(permission);
                $('#modalPermission').modal('show');
            },
            newPermission() {
                this.form.clear();
                this.form.reset();
                this.editMode = false
                $('#modalPermission').modal('show');
                this.modalTitle = 'Incluir nova permissão';
            },
            permissionRoles(permissionId) {

            },
            permissionTokens(permissionId) {

            },
            permissionUsers(permissionId) {

            },

        }
    }
</script>
