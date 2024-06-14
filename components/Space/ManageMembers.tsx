import { useFindManyProfile } from '@/zmodel/lib/hooks';

export default function ManageMembers() {
    const { data: profiles } = useFindManyProfile();
    return <div>Profiles{profiles?.map((profile) => profile.role)}</div>;
}
