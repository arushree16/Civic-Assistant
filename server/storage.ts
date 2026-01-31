import { issues, messages, type Issue, type InsertIssue, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  getIssues(): Promise<Issue[]>;
  getIssue(id: number): Promise<Issue | undefined>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  updateIssueStatus(id: number, status: string, updates: any[]): Promise<Issue>;
  simulateTimePassing(days: number): Promise<void>;
  
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private issues: Map<number, Issue>;
  private messages: Map<number, Message>;
  private issueIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.issues = new Map();
    this.messages = new Map();
    this.issueIdCounter = 1;
    this.messageIdCounter = 1;

    // Seed some data
    this.seedData();
  }

  private seedData() {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    
    const seedIssues: InsertIssue[] = [
      {
        description: "Garbage piled up at the corner of MG Road",
        category: "Waste",
        location: "MG Road, Block A",
        status: "In Progress",
        affectedCount: 12,
        daysUnresolved: 3,
      },
      {
        description: "Street light flickering near community park",
        category: "Energy",
        location: "Sector 4 Park",
        status: "Reported",
        affectedCount: 50,
        daysUnresolved: 1,
      },
      {
        description: "Water pipe leaking, flooding the street",
        category: "Water",
        location: "Market Street",
        status: "Forwarded",
        affectedCount: 5,
        daysUnresolved: 2,
      },
      {
        description: "Large pothole causing traffic slowing",
        category: "Transport",
        location: "Main Highway Exit",
        status: "Resolved",
        affectedCount: 100,
        daysUnresolved: 0,
      }
    ];

    seedIssues.forEach(issueData => {
      const id = this.issueIdCounter++;
      const issue: Issue = {
        id,
        ...issueData,
        createdAt: threeDaysAgo,
        resolvedAt: issueData.status === "Resolved" ? now : null,
        updates: [{ status: "Reported", date: threeDaysAgo.toISOString() }],
        affectedCount: issueData.affectedCount || 1,
        daysUnresolved: issueData.daysUnresolved || 0,
      };
      this.issues.set(id, issue);
    });

    const seedMessages: InsertMessage[] = [
      { role: "assistant", content: "Hello! I am Nagrik Seva, your civic help partner. Describe your issue, and I'll help you report it." }
    ];
    seedMessages.forEach(msg => this.createMessage(msg));
  }

  async getIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values()).sort((a, b) => b.id - a.id);
  }

  async getIssue(id: number): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = this.issueIdCounter++;
    const now = new Date();
    const issue: Issue = {
      id,
      ...insertIssue,
      createdAt: now,
      resolvedAt: null,
      status: insertIssue.status || "Reported",
      affectedCount: insertIssue.affectedCount || 1,
      daysUnresolved: 0,
      updates: [{ status: "Reported", date: now.toISOString() }],
    };
    this.issues.set(id, issue);
    return issue;
  }

  async updateIssueStatus(id: number, status: string, newUpdates: any[]): Promise<Issue> {
    const issue = this.issues.get(id);
    if (!issue) throw new Error("Issue not found");

    const resolvedAt = status === "Resolved" ? new Date() : issue.resolvedAt;
    const updatedIssue = { ...issue, status, updates: newUpdates, resolvedAt };
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  async simulateTimePassing(days: number): Promise<void> {
    for (const [id, issue] of this.issues) {
      if (issue.status !== "Resolved") {
        issue.daysUnresolved = (issue.daysUnresolved || 0) + days;
        this.issues.set(id, issue);
      }
    }
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => a.id - b.id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const message: Message = {
      id,
      role: insertMessage.role,
      content: insertMessage.content,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
