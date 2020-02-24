import { replaceMultipleValues } from '../../chronologic/utils/utils';


describe('utils', () => {

    describe('replaceMultipleValues', () => {
        const assertMultipleValues = (values, callback) => {
            for(const value in values) {
                callback(value);
            }
        }
    
        describe('when there are no values to replace with', () => {
            const invalidValues = [
                null,
                undefined,
                []
            ];

            it('should throw an error', () => {
                assertMultipleValues(invalidValues, (value) => {
                    expect(replaceMultipleValues(value, {}, '')).toThrowError('No [values] parameter provided');
                });
            });
        });
        
        describe('when no positions are given', () => {
            const invalidValues = [
                null,
                undefined,
                {}
            ];
            
            it('should throw an error', () => {
                assertMultipleValues(invalidValues, (value) => {
                    expect(replaceMultipleValues([1], value, '')).toThrowError('No [positions] parameter provided');
                });
            });
        });

        describe('when no container is provided', () => {
            const invalidValues = [
                null,
                undefined,
                '',
                []
            ];
            
            it('should throw an error', () => {
                const positions = {p:{}};
                assertMultipleValues(invalidValues, (value) => {
                    expect(replaceMultipleValues([1], positions, value)).toThrowError('No [container] parameter provided');
                });
            });
        });
    });

    describe('when positions are invalid', () => {

        const invalidPositions = {
            monday: 1,
            month: 2,
            year: 1
        };
        const invalidPosition = {
            start: 1,
            day: 2
        };

        const swapMapValue = (map, oldValue, newValue) => {
            delete map[oldValue];
            map[newValue] = 1;
        };

        it('', () => {
            expect(replaceMultipleValues(invalidPositions)).toThrowError('Invalid [positions] parameter provided');
        });

        it('', () => {
            expect(replaceMultipleValues(invalidPosition)).toThrowError('Invalid [positions] parameter provided');
        });

        it('', () => {
            swapMapValue(invalidPositions, 'monday', 'day');
            swapMapValue(invalidPositions, 'month', 'monthy');
            expect(replaceMultipleValues(invalidPosition)).toThrowError('Invalid [positions] parameter provided');
        });
        
        it('', () => {
            swapMapValue(invalidPositions, 'monday', 'day');
            swapMapValue(invalidPositions, 'monthy', 'month');
            swapMapValue(invalidPositions, 'year', 'yearly');
            expect(replaceMultipleValues(invalidPosition)).toThrowError('Invalid [positions] parameter provided');
        });
    });
})