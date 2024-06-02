import { PlusIcon } from "@heroicons/react/24/outline";
import { useCurrentSpace } from "@/lib/context";
import { useFindManySpaceUser } from "@/zmodel/lib/hooks";
import { Space } from "@prisma/client";
import ManageMembers from "./ManageMembers";
import { UserAvatar } from "../UserAvatar";

function ManagementDialog(space?: Space) {
	if (!space) {
		return void 0;
	}
	return (
		<>
			<label htmlFor="management-modal" className="modal-button">
				<PlusIcon className="mr-1 size-6 cursor-pointer text-gray-500" />
			</label>

			<input type="checkbox" id="management-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box">
					<h3 className="text-base font-bold md:text-lg">Manage Members of {space.name}</h3>

					<div className="mt-4 p-4">
						<ManageMembers space={space} />
					</div>

					<div className="modal-action">
						<label htmlFor="management-modal" className="btn btn-outline">
                            Close
						</label>
					</div>
				</div>
			</div>
		</>
	);
}

export function SpaceMembers() {
	const space = useCurrentSpace();

	const { data: members } = useFindManySpaceUser(
		{
			where: {
				spaceId: space?.id
			},
			include: {
				user: true
			},
			orderBy: {
				role: "desc"
			}
		},
		{ enabled: !!space }
	);

	return (
		<div className="flex items-center">
			{ManagementDialog(space)}
			{members &&
				<label className="modal-button mr-1 cursor-pointer" htmlFor="management-modal">
					{members?.map((member) =>
						<UserAvatar key={member.id} user={member.user} size={24} />
					)}
				</label>
			}
		</div>
	);
}
