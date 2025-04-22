import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

// GET all jobs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get("search") || ""
    const careerFilter = searchParams.get("career") || ""

    let jobs
    if (searchQuery || careerFilter) {
      let sql = `SELECT j.* FROM jobs j WHERE 1=1`
      const params = []

      if (searchQuery) {
        sql += ` AND (j.title LIKE ? OR j.company LIKE ? OR j.description LIKE ?)`
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`)
      }

      if (careerFilter) {
        // This is a simplified approach - in a real app, you'd have a proper relationship between jobs and careers
        sql += ` AND j.title LIKE ?`
        params.push(`%${careerFilter}%`)
      }

      jobs = await query(sql, params)
    } else {
      jobs = await query("SELECT * FROM jobs")
    }

    // For each job, get its requirements and responsibilities
    if (Array.isArray(jobs)) {
      for (const job of jobs as RowDataPacket[]) {
        const requirements = (await query("SELECT requirement FROM job_requirements WHERE job_id = ?", [
          job.id,
        ])) as RowDataPacket[]

        const responsibilities = (await query("SELECT responsibility FROM job_responsibilities WHERE job_id = ?", [
          job.id,
        ])) as RowDataPacket[]

        job.requirements = Array.isArray(requirements) ? requirements.map((r) => r.requirement) : []
        job.responsibilities = Array.isArray(responsibilities) ? responsibilities.map((r) => r.responsibility) : []
      }
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// POST create a new job
export async function POST(request: Request) {
  try {
    const {
      title,
      company,
      location,
      salaryRange,
      description,
      jobType,
      experienceRequired,
      applicationDeadline,
      requirements,
      responsibilities,
    } = await request.json()

    // Insert the job
    const result = (await query(
      `INSERT INTO jobs (title, company, location, salary_range, description, job_type, experience_required, application_deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, company, location, salaryRange, description, jobType, experienceRequired, applicationDeadline],
    )) as ResultSetHeader

    const jobId = result.insertId

    // Add requirements
    if (requirements && requirements.length > 0) {
      for (const requirement of requirements) {
        await query("INSERT INTO job_requirements (job_id, requirement) VALUES (?, ?)", [jobId, requirement])
      }
    }

    // Add responsibilities
    if (responsibilities && responsibilities.length > 0) {
      for (const responsibility of responsibilities) {
        await query("INSERT INTO job_responsibilities (job_id, responsibility) VALUES (?, ?)", [jobId, responsibility])
      }
    }

    return NextResponse.json(
      {
        message: "Job created successfully",
        jobId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}

