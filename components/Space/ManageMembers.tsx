import { useFindManyProfile } from '@/zmodel/lib/hooks';

export default function ManageMembers() {
    const { data: profiles } = useFindManyProfile();
    return <div>{profiles?.map((profile) => profile.role)}</div>;
}
