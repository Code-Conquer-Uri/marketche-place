import type { MemberRepository } from "@/domain/master/application/repositories/member.repository";
import type { Member } from "@/domain/master/enterprise/entities/member";

export class InMemoryMemberRepository implements MemberRepository {
  async create(member: Member): Promise<void> {
    this.members.push(member);
  }

  async findById(id: string): Promise<Member | null> {
    const member = this.members.find((member) => member.id.toString() === id);
    if (!member) {
      return null;
    }

    return member;
  }

  async findByOrganizationId(organizationId: string): Promise<Member[]> {
    return this.members.filter(
      (member) => member.organizationId.toString() === organizationId,
    );
  }

  async findByUserId(userId: string): Promise<Member[]> {
    return this.members.filter((member) => member.userId.toString() === userId);
  }

  async findByUserIdAndOrganizationId(
    userId: string,
    organizationId: string,
  ): Promise<Member | null> {
    const member = this.members.find(
      (member) =>
        member.userId.toString() === userId &&
        member.organizationId.toString() === organizationId,
    );
    if (!member) {
      return null;
    }

    return member;
  }

  async findAll(): Promise<Member[]> {
    return this.members;
  }

  async save(member: Member): Promise<void> {
    const index = this.members.findIndex(
      (m) => m.id.toString() === member.id.toString(),
    );
    if (index !== -1) {
      this.members[index] = member;
    } else {
      throw new Error("Member not found");
    }
  }

  async delete(member: Member): Promise<void> {
    const index = this.members.findIndex(
      (m) => m.id.toString() === member.id.toString(),
    );
    if (index !== -1) {
      this.members.splice(index, 1);
    } else {
      throw new Error("Member not found");
    }
  }

  private members: Member[] = [];
}
