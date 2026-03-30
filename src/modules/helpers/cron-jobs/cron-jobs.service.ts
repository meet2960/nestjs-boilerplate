import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { get } from 'lodash-es';
import * as shelljs from 'shelljs';
import { ResponseTypeService } from '../response-type/response-type.service';
import { cronJobsData } from '@/common/constants/cron-jobs-code';

// import { Client } from 'pg';

@Injectable()
export class CronJobsService {
  constructor(
    private readonly responseType: ResponseTypeService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  getCronStatus(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (!job) {
        throw new NotFoundException(`Cron job ${name} not found`);
      }

      return this.responseType.successResponse({
        data: {
          isActive: get(job, 'isActive', false),
          jobName: name,
          lastExecution: job.lastExecution,
        },
        message: `Cron job ${name} status fetch successfully`,
      });
    } catch (error) {
      return this.responseType.errorResponse({
        message: 'Cron job status could not be fetched',
        data: null,
        error,
      });
    }
  }

  startCron(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (!job) throw new NotFoundException(`Cron job ${name} not found`);
      job.start();

      return this.responseType.successResponse({
        message: `Cron job ${name} started successfully`,
        data: {
          isActive: get(job, 'isActive', false),
          jobName: job.name,
          lastExecution: job.lastExecution,
        },
      });
    } catch (error) {
      return this.responseType.errorResponse({
        message: 'Cron job could not be started',
        data: null,
        error,
      });
    }
  }

  stopCron(name: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      if (!job) throw new NotFoundException(`Cron job ${name} not found`);
      job.stop();

      return this.responseType.successResponse({
        message: `Cron job ${name} stopped successfully`,
        data: {
          isActive: get(job, 'isActive', false),
          jobName: job.name,
        },
      });
    } catch (error) {
      return this.responseType.errorResponse({
        message: 'Cron job could not be stopped',
        data: null,
        error,
      });
    }
  }

  //#region // * Backup DB Code
  private backupDatabase() {
    try {
      const postgresRegex = `/postgresql:\/\/(.+):(.+)@(.+):(\d+)\/(.+)/`;
      const dbUrl = '';
      const dbMatch = RegExp(postgresRegex).exec(dbUrl);
      if (!dbMatch) {
        console.error('Failed to parse DATABASE_URL');
        return this.responseType.errorResponse({
          message: 'Failed to parse DATABASE_URL',
          data: null,
        });
      }

      const [, user, password, host, port, database] = dbMatch;
      const backupPath = `./src/public/db-backup/cloud_${database}_${Date.now()}.sql`;

      // Command to dump the PostgreSQL database
      const dumpCommand = `PGPASSWORD=${password} pg_dump -h ${host} -p ${port} -U ${user} -d ${database} -F c -f ${backupPath}`;

      // Execute the backup
      if (shelljs.exec(dumpCommand).code !== 0) {
        console.error('Database backup failed! for ', database);
        return this.responseType.errorResponse({
          message: 'Database backup Failed!',
          data: null,
        });
      } else {
        console.log(`Database backup completed successfully: ${backupPath}`);
        return this.responseType.successResponse({
          message: 'Database backup completed successfully',
          data: { backupPath },
        });
      }
    } catch (error) {
      console.error('Error during database backup:');
      return this.responseType.errorResponse({
        message: 'Error during database backup',
        data: null,
        error,
      });
    }
  }
  //#endregion

  //#region // * Default Db Queries to Run
  //   private defaultDbQueries() {
  //     // const client = new Client(dbUrl);

  //     try {
  //       const ddlQuery = `
  //                   ALTER TABLE lens.workspaces
  //                   ADD COLUMN active_status varchar(100) DEFAULT 'active'  NOT NULL;

  //                   COMMENT ON COLUMN lens.workspaces.active_status IS
  //                   'Indicates whether the workspace is active, inactive, or in another status.';
  //         `;

  //       //   await client.connect();
  //       //   console.log(`Connected to ${database}`);
  //       //   await client.query(ddlQuery);
  //       //   console.log(`✅ DDL applied to ${database}`);
  //     } catch (error) {
  //       console.error('Error in Default DB Queries');
  //       //   console.error(`❌ Error applying DDL to ${database}:`, error);
  //     } finally {
  //       console.log('Finally');
  //     }
  //   }
  //#endregion

  @Cron(cronJobsData.backupDatabase.schedule, {
    name: cronJobsData.backupDatabase.name,
    disabled: cronJobsData.backupDatabase.isDisabled,
    waitForCompletion: true,
  })
  backupDB() {
    this.backupDatabase();
  }
}
