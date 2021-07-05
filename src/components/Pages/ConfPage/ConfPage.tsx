import {
    Header,
    InnerLayoutContainer,
    List,
    Meta,
    ResultDetails,
    SearchInput
} from 'components';
import * as React from 'react';
import useSearch from '../../../hooks/useSearch';
onferencePage';

export const ConfPage: React.FC<any> = () => {
    const {
        localQuery,
        conference,
        filteredList,
        onInputChange,
        numberOfVideos,
        numberOfConferences
    } = useConferencePage("/conference/:name")
    return (
        <div>
            <Meta title={conference?.title || ''} />
            <Header
                title={conference?.title || ''}
                titleLink={conference?.website || ''}
                tagline={`
        ${conference?.date || ''} \-
        ${conference?.videos.length} \
        ${conference?.videos?.length !== 1
                        ? 'videos'
                        : 'video'
                    } `}
            />
            <InnerLayoutContainer>
                <SearchInput
                    onChange={onInputChange}
                    filterValue={localQuery}
                    placeholder={`Search ${conference?.title}`}
                />
                <ResultDetails numberOfVideos={numberOfVideos} numberOfConferences={numberOfConferences} />
                <List conferences={filteredList} />
            </InnerLayoutContainer>
        </div>
    );
};
