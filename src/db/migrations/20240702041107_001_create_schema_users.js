/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('phone_no').unique().notNullable();
    table.string("password").notNullable();
    table
      .datetime("createdAt")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"))
      .notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
