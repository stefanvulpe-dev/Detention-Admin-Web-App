import { pool } from '../models/db/pool.js';

export class VisitsRepository {
  async create(visitDetails) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'insert into visits (id, "date", "time", "nature", "objects", "mood", "summary") values (default, $1, $2, $3, $4, $5, $6) returning *',
        [
          visitDetails.visitDate,
          visitDetails.visitTime,
          visitDetails.visitNature,
          visitDetails.objectData,
          visitDetails.prisonerMood,
          visitDetails.summary,
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'select * from visits where "id" = $1',
        [+id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async recordGuestVisits(guestsData, visitId) {
    const client = await pool.connect();
    const dataInserted = [];
    try {
      for (const packet of guestsData) {
        const result = await client.query(
          'insert into guests_visits (id, "prisonerRelation", "visitId", "guestId") values (default, $1, $2, $3) returning *',
          [packet.relation, visitId, packet.id]
        );
        dataInserted.push(result.rows[0]);
      }
      return dataInserted;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async recordPrisonerVisits(prisonerId, visitId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'insert into prisoners_visits (id, "prisonerId", "visitId") values (default, $1, $2) returning *',
        [prisonerId, visitId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async findVisit(firstName, lastName) {
    const client = await pool.connect();
    try {
      const query = {
        name: 'find-visit',
        text: `select v.id
                from visits v
                join guests_visits gv on v.id = gv."visitId"
                join guests g on gv."guestId" = g.id and g."firstName" = $1 and g."lastName" = $2`,
        values: [firstName, lastName],
      };
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async getNumberOfVisitsPerMonth(month) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `select count(*)
        from visits
        where date >= now() - INTERVAL '1 year'
        and extract(month from date) = $1
        and date <= now();`,
        [month]
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }
}
